import dimensions from "../../config/dimensions.js";
import blockData from "../data/block-data.js";
import Block from "../objects/block.js";

export default class gameplay extends Phaser.Scene {
    constructor() {
        super({ key: 'gameplay' });
    }
    init() {
        this.row = 4
        this.col = 4
        this.blocksArr = [];
        this.finalData = [];
        this.blockData = blockData.arr;
        this.canPress = true;
        this.tempBlocksArr = [];
        this.drawBoard();

        for (let i = 0; i < this.row; i++) {
            this.blocksArr[i] = [];
            for (let j = 0; j < this.col; j++) {
                this.block = new Block(this, i, j, this.blockData[i][j]);
                this.blocksArr[i].push(this.block);
            }
        }

        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                for (let k = 0; k < 3; k++) {
                    let tempBlock = new Block(this, i, j, 0);
                    tempBlock.hide();
                    this.tempBlocksArr.push(tempBlock);
                }
            }
        }



        // for (let i = 0; i < this.row * this.col; i++) {
        //     let tempBlock = new Block(this, 0, 0, 0);
        //     tempBlock.hide();
        //     this.tempBlocksArr.push(tempBlock);
        // }
        // console.log(this.tempBlocksArr);

        this.input.keyboard.on('keydown', this.onPressDown, this);
        this.input.keyboard.on('keyup', this.onPressUp, this);
    }

    onPressUp() {
        this.canPress = true
    }

    onPressDown(event) {
        if (this.canPress) {
            this.canPress = false
            switch (event.key) {
                case 'ArrowUp':
                    this.upFindSameBlock();
                    this.addAtRandomPlace();
                    this.findGameOver();
                    break;
                case 'ArrowDown':
                    this.downFindSameBlock()
                    this.addAtRandomPlace();
                    this.findGameOver();
                    break;
                case 'ArrowLeft':
                    this.leftFindSameBlock()
                    this.addAtRandomPlace();
                    this.findGameOver();
                    break;
                case 'ArrowRight':
                    this.rightFindSameBlock()
                    this.addAtRandomPlace();
                    this.findGameOver();
                    break;
            }
        }
    }

    drawBoard() {
        let setX = dimensions.width / 2 - 209
        let setY = dimensions.height * 0.45 - 160
        let board = this.add.graphics({ x: setX, y: setY })
        // board.lineStyle(5, 0xffffff, 1);   // color: 0xRRGGBB
        board.fillStyle(0x776E65, 0.5)
        board.strokeRoundedRect(0, 0, 530, 530, 10);
        board.fillRoundedRect(0, 0, 530, 530, 10);
    }


    upFindSameBlock() {
        let data;
        for (let j = 0; j < this.col; j++) {
            for (let i = 0; i < this.row; i++) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = i + 1; k < this.row; k++) {
                        if (this.blocksArr[k][j].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[k][j].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                                data = {
                                    'src1': this.blocksArr[i][j],
                                    'value1': this.blocksArr[i][j].numState,
                                    'des1': null,
                                    'src2': this.blocksArr[k][j],
                                    'value2': this.blocksArr[k][j].numState,
                                    'des2': null,
                                    'total': total,
                                    'isMatched': true
                                }
                                this.blocksArr[i][j].markedData = data;
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.upSetEmptyBlock();
        this.move();
        this.finalData = [];
    }

    upSetEmptyBlock() {
        let data;
        for (let j = 0; j < this.col; j++) {
            for (let i = 0; i < this.row; i++) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = i + 1; k < this.row; k++) {
                        if (this.blocksArr[k][j].numState) {
                            const total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                            data = {
                                'des': this.blocksArr[i][j],
                                'src': this.blocksArr[k][j],
                                'total': total,
                            }
                            this.setEmptyblockState(data);
                            if (this.blocksArr[k][j].markedData) {
                                this.blocksArr[k][j].markedData.des1 = data.des
                                this.blocksArr[k][j].markedData.des2 = data.des

                                this.finalData.push(this.blocksArr[k][j].markedData);
                            } else {
                                this.finalData.push(data);
                            }
                            break;
                        }
                    }
                } else {
                    if (this.blocksArr[i][j].markedData) {
                        this.blocksArr[i][j].markedData.des1 = this.blocksArr[i][j].markedData.src1
                        this.blocksArr[i][j].markedData.des2 = this.blocksArr[i][j].markedData.src1
                        this.finalData.push(this.blocksArr[i][j].markedData);
                    }
                }
                this.blocksArr[i][j].markedData = null;
            }
        }
    }

    move() {
        const duration = 150
        for (let i = 0; i < this.finalData.length; i++) {
            if (this.finalData[i].isMatched) {
                this.moveTween(this.finalData[i].src1, this.finalData[i].des1, this.finalData[i].value1, duration);
                this.moveTween(this.finalData[i].src2, this.finalData[i].des2, this.finalData[i].value1, duration);
                this.time.delayedCall(duration, this.popupTween, [this.finalData[i].des1, duration], this);

            } else {
                this.moveTween(this.finalData[i].src, this.finalData[i].des, this.finalData[i].total, duration)
                this.time.delayedCall(duration, this.popupTween, [this.finalData[i].des, duration], this);
            }
        }
    }

    moveTween(src, des, value, givenDuration) {
        // if (src.i === des.i && src.j === des.j) { return }
        src.clearColor();
        des.clearColor();
        // let tempBlock = new Block(this, src.i, src.j, value);

        let tempBlock = this.tempBlocksArr.pop();

        // tempBlock.i = src.i
        // tempBlock.j = src.j
        // tempBlock.numState = value

        // console.log(tempBlock);
        tempBlock.rePos(src.i, src.j, value);
        // tempBlock.rePos(tempBlock.i, tempBlock.j, tempBlock.numState);
        tempBlock.setBlockText();
        tempBlock.show();

        // console.log(tempBlock);

        this.tweens.add({
            targets: [tempBlock.graphicsRect, tempBlock.blockText],
            ease: 'Linear',
            duration: givenDuration,
            x: des.graphicsRect.x,
            y: des.graphicsRect.y,
            // onComplete: () => { tempBlock.destroy(); }
            onComplete: () => {
                tempBlock.hide();
                this.tempBlocksArr.unshift(tempBlock)
            }
        });

    }

    popupTween(desBlock, givenDuration) {
        desBlock.copyGraphics();
        desBlock.setBlockText();
        desBlock.blockText.visible = true;

        this.tweens.add({
            targets: [desBlock.graphicsRect, desBlock.blockText],
            ease: 'Back.easeOut',
            duration: givenDuration,
            scale: { from: 0.75, to: 1 },
        });
    }

    addAtRandomPlace() {
        let emptyBlockArr = []
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.blocksArr[i][j].numState === 0) {
                    emptyBlockArr.push(this.blocksArr[i][j]);
                }
            }
        }
        let randomNum = Phaser.Math.Between(0, emptyBlockArr.length - 1);

        const emptyBlock = emptyBlockArr[randomNum];
        if (!emptyBlock) {
            return
        }
        emptyBlock.numState = 2;
        this.popupTween(emptyBlock, 150);
    }

    findGameOver() {
        this.isGameover = true;
        for (let j = 0; j < this.col; j++) {
            for (let i = 0; i < this.row; i++) {
                if ((this.blocksArr[i + 1] &&
                    this.blocksArr[i][j].numState === this.blocksArr[i + 1][j].numState) ||
                    (this.blocksArr[i][j + 1] &&
                        this.blocksArr[i][j].numState === this.blocksArr[i][j + 1].numState) &&
                    this.blocksArr[i][j].numState !== 0
                ) {
                    this.isGameover = false
                    break
                }
            }
            if (!this.isGameover) {
                break;
            }
        }
        if (this.isGameover) {
            console.log("gameover");
            // this.canPress = false
            return;
        }
    }


    downFindSameBlock() {
        let data
        for (let j = 0; j < this.col; j++) {
            for (let i = this.row - 1; i >= 0; i--) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.blocksArr[k][j].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[k][j].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                                data = {
                                    'src1': this.blocksArr[i][j],
                                    'value1': this.blocksArr[i][j].numState,
                                    'des1': null,
                                    'src2': this.blocksArr[k][j],
                                    'value2': this.blocksArr[k][j].numState,
                                    'des2': null,
                                    'total': total,
                                    'isMatched': true
                                }
                                this.blocksArr[i][j].markedData = data;
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.downSetEmptyBlock();
        this.move();
        this.finalData = [];
    }

    downSetEmptyBlock() {
        for (let j = 0; j < this.col; j++) {
            for (let i = this.row - 1; i >= 0; i--) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.blocksArr[k][j].numState) {
                            const total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                            const data = {
                                'des': this.blocksArr[i][j],
                                'src': this.blocksArr[k][j],
                                'total': total,
                            }
                            this.setEmptyblockState(data);
                            if (this.blocksArr[k][j].markedData) {
                                this.blocksArr[k][j].markedData.des1 = data.des
                                this.blocksArr[k][j].markedData.des2 = data.des

                                this.finalData.push(this.blocksArr[k][j].markedData);
                            } else {
                                this.finalData.push(data);
                            }
                            break;
                        }
                    }
                } else {
                    if (this.blocksArr[i][j].markedData) {
                        this.blocksArr[i][j].markedData.des1 = this.blocksArr[i][j].markedData.src1
                        this.blocksArr[i][j].markedData.des2 = this.blocksArr[i][j].markedData.src1
                        this.finalData.push(this.blocksArr[i][j].markedData);
                    }
                }
                this.blocksArr[i][j].markedData = null;
            }
        }
    }

    leftFindSameBlock() {
        let data;
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = j + 1; k < this.col; k++) {
                        if (this.blocksArr[i][k].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[i][k].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                                data = {
                                    'src1': this.blocksArr[i][j],
                                    'value1': this.blocksArr[i][j].numState,
                                    'des1': null,
                                    'src2': this.blocksArr[i][k],
                                    'value2': this.blocksArr[i][k].numState,
                                    'des2': null,
                                    'total': total,
                                    'isMatched': true
                                }
                                this.blocksArr[i][j].markedData = data;
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.leftSetEmptyBlock();
        this.move();
        this.finalData = [];
    }

    leftSetEmptyBlock() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = j + 1; k < this.col; k++) {
                        if (this.blocksArr[i][k].numState) {
                            const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                            const data = {
                                'des': this.blocksArr[i][j],
                                'src': this.blocksArr[i][k],
                                'total': total,
                            }
                            this.setEmptyblockState(data);
                            if (this.blocksArr[i][k].markedData) {
                                this.blocksArr[i][k].markedData.des1 = data.des
                                this.blocksArr[i][k].markedData.des2 = data.des

                                this.finalData.push(this.blocksArr[i][k].markedData);
                            } else {
                                this.finalData.push(data);
                            }
                            break;
                        }
                    }
                } else {
                    if (this.blocksArr[i][j].markedData) {
                        this.blocksArr[i][j].markedData.des1 = this.blocksArr[i][j].markedData.src1
                        this.blocksArr[i][j].markedData.des2 = this.blocksArr[i][j].markedData.src1
                        this.finalData.push(this.blocksArr[i][j].markedData);
                    }
                }
                this.blocksArr[i][j].markedData = null;

            }
        }
    }

    rightFindSameBlock() {
        let data
        for (let i = 0; i < this.row; i++) {
            for (let j = this.col - 1; j >= 0; j--) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = j - 1; k >= 0; k--) {
                        if (this.blocksArr[i][k].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[i][k].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                                data = {
                                    'src1': this.blocksArr[i][j],
                                    'value1': this.blocksArr[i][j].numState,
                                    'des1': null,
                                    'src2': this.blocksArr[i][k],
                                    'value2': this.blocksArr[i][k].numState,
                                    'des2': null,
                                    'total': total,
                                    'isMatched': true
                                }
                                this.blocksArr[i][j].markedData = data;
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.rightSetEmptyBlock();
        this.move();
        this.finalData = [];
    }

    rightSetEmptyBlock() {
        for (let i = 0; i < this.row; i++) {
            for (let j = this.col - 1; j >= 0; j--) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = j - 1; k >= 0; k--) {
                        if (this.blocksArr[i][k].numState) {
                            const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                            const data = {
                                'des': this.blocksArr[i][j],
                                'src': this.blocksArr[i][k],
                                'total': total,
                            }
                            this.setEmptyblockState(data);
                            if (this.blocksArr[i][k].markedData) {
                                this.blocksArr[i][k].markedData.des1 = data.des
                                this.blocksArr[i][k].markedData.des2 = data.des

                                this.finalData.push(this.blocksArr[i][k].markedData);
                            } else {
                                this.finalData.push(data);
                            }
                            break;
                        }
                    }
                } else {
                    if (this.blocksArr[i][j].markedData) {
                        this.blocksArr[i][j].markedData.des1 = this.blocksArr[i][j].markedData.src1
                        this.blocksArr[i][j].markedData.des2 = this.blocksArr[i][j].markedData.src1
                        this.finalData.push(this.blocksArr[i][j].markedData);
                    }
                }
                this.blocksArr[i][j].markedData = null;

            }
        }
    }

    setBlockState(data) {
        data.src1.numState = 0
        data.src2.numState = 0
        data.src1.numState = data.total

        // data.src1.setBlockText()
        // data.src2.setBlockText()
    }

    setEmptyblockState(data) {
        data.des.numState = 0
        data.src.numState = 0
        data.des.numState = data.total

        // data.des.setBlockText()
        // data.src.setBlockText()
    }
}