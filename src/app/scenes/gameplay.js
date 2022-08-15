import blockData from "../data/block-data.js";
import Block from "../objects/block.js";

export default class gameplay extends Phaser.Scene {
    constructor() {
        super({ key: 'gameplay' });
    }
    init() {
        // console.log("asasa");
        this.row = 4
        this.col = 4
        this.index = 0;
        this.blocksArr = [];
        this.finalData = [];
        this.blockData = blockData.arr;


        for (let i = 0; i < this.row; i++) {
            this.blocksArr[i] = [];
            for (let j = 0; j < this.col; j++) {
                this.block = new Block(this, i, j, this.blockData[i][j]);
                this.blocksArr[i].push(this.block);
            }
        }
        this.input.keyboard.on('keydown', this.onPress, this);
    }

    onPress(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.upFindSameBlock()
                break;
            case 'ArrowDown':
                this.downFindSameBlock()
                break;
            case 'ArrowLeft':
                this.leftFindSameBlock()
                break;
            case 'ArrowRight':
                this.rightFindSameBlock()
                break;
        }
        this.addAtRandomPlace();
    }

    upFindSameBlock() {
        // console.log('upFindSameBlock');
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
        // console.log('upSetEmptyBlock');
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
                        // console.log(this.finalData);
                    }
                }
                this.blocksArr[i][j].markedData = null;
            }
        }
        console.log(this.finalData);
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
        let tempBlock = new Block(this, src.i, src.j, value);
        console.log(tempBlock.numState);
        this.tweens.add({
            targets: [tempBlock.graphicsRect, tempBlock.blockText],
            ease: 'Linear',
            duration: givenDuration,
            x: des.graphicsRect.x,
            y: des.graphicsRect.y,
            onComplete: () => {
                tempBlock.destroy();
            }
        });

    }

    popupTween(des, givenDuration) {

        des.copyGraphics();

        des.setBlockText();
        des.blockText.visible = true;
        this.tweens.add({
            targets: [des.graphicsRect, des.blockText],
            ease: 'Back.easeOut',
            duration: givenDuration,
            scale: { from: 0, to: 1 },
        });
    }



    downFindSameBlock() {
        // console.log('downFindSameBlock');
        for (let j = 0; j < this.col; j++) {
            for (let i = this.row - 1; i >= 0; i--) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.blocksArr[k][j].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[k][j].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                                const data = {
                                    'src1': this.blocksArr[i][j],
                                    'src2': this.blocksArr[k][j],
                                    'total': total,
                                }
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.downSetEmptyBlock();
    }

    downSetEmptyBlock() {
        // console.log('downSetEmptyBlock');
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
                            break;
                        }
                    }
                }
            }
        }
    }

    leftFindSameBlock() {
        // console.log('leftFindSameBlock');
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = j + 1; k < this.col; k++) {
                        if (this.blocksArr[i][k].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[i][k].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                                const data = {
                                    'src1': this.blocksArr[i][j],
                                    'src2': this.blocksArr[i][k],
                                    'total': total,
                                }
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.leftSetEmptyBlock();
    }

    leftSetEmptyBlock() {
        // console.log('leftSetEmptyBlock');
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
                            break;
                        }
                    }
                }
            }
        }
    }

    rightFindSameBlock() {
        for (let i = 0; i < this.row; i++) {
            for (let j = this.col - 1; j >= 0; j--) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = j - 1; k >= 0; k--) {
                        if (this.blocksArr[i][k].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[i][k].numState) {
                                const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                                const data = {
                                    'src1': this.blocksArr[i][j],
                                    'src2': this.blocksArr[i][k],
                                    'total': total,
                                }
                                this.setBlockState(data);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.rightSetEmptyBlock();
    }

    rightSetEmptyBlock() {
        // console.log('rightSetEmptyBlock');
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
                            break;
                        }
                    }
                }
            }
        }
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
        let value = Phaser.Math.Between(0, emptyBlockArr.length - 1);
        emptyBlockArr[value].numState = 2;
        emptyBlockArr[value].setBlockText();
    }

    setBlockState(data) {
        // console.log('setBlockState');
        data.src1.numState = 0
        data.src2.numState = 0
        data.src1.numState = data.total

        // data.src1.setBlockText()
        // data.src2.setBlockText()
    }

    setEmptyblockState(data) {
        // console.log('setBlockState');
        data.des.numState = 0
        data.src.numState = 0
        data.des.numState = data.total

        // data.des.setBlockText()
        // data.src.setBlockText()
    }
}