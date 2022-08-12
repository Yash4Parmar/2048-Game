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
        // console.log(this.blocksArr);
        this.input.keyboard.on('keydown', this.onPress, this);

    }
    onPress(event) {
        // console.log(event);
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

            default:
                break;
        }
        this.addAtRandomPlace();

    }

    upFindSameBlock() {
        // console.log('upFindSameBlock');
        let total;
        for (let j = 0; j < this.col; j++) {
            for (let i = 0; i < this.row; i++) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = i + 1; k < this.row; k++) {
                        if (this.blocksArr[k][j].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[k][j].numState) {
                                total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                                const values = {
                                    'col': j,
                                    'total': total,
                                    'block1': this.blocksArr[i][j],
                                    'block2': this.blocksArr[k][j]
                                }
                                this.finalData.push(values)
                                let emptyBlock;
                                if (!emptyBlock) {
                                    emptyBlock = values.block1
                                    this.finalData.push(values.emptyBlock = emptyBlock)
                                }
                                // console.log(this.finalData);
                                this.setBlockState(emptyBlock, values);
                                this.upSetEmptyBlock();
                            }
                            break;
                        }
                    }
                }
                // else this.upSetEmptyBlock()
            }
        }
        this.upSetEmptyBlock()
    }

    upSetEmptyBlock() {
        // console.log('upSetEmptyBlock');
        let total
        for (let j = 0; j < this.col; j++) {
            for (let i = 0; i < this.row; i++) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = i + 1; k < this.row; k++) {
                        if (this.blocksArr[k][j].numState) {
                            total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                            const values = {
                                'total': total,
                                'block1': this.blocksArr[i][j],
                                'block2': this.blocksArr[k][j],
                            }
                            this.setEmptyBlockState(values);
                            break;
                        }
                    }
                }
            }
        }
        // this.addAtRandomPlace()

    }

    downFindSameBlock() {
        // console.log('downFindSameBlock');
        let total;
        for (let j = 0; j < this.col; j++) {
            for (let i = this.row - 1; i >= 0; i--) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.blocksArr[k][j].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[k][j].numState) {
                                total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                                const values = {
                                    'col': j,
                                    'total': total,
                                    'block1': this.blocksArr[i][j],
                                    'block2': this.blocksArr[k][j]
                                }
                                this.finalData.push(values)
                                let emptyBlock;
                                if (!emptyBlock) {
                                    emptyBlock = values.block1
                                    this.finalData.push(values.emptyBlock = emptyBlock)
                                }
                                // console.log(this.blocksArr[i][j]);
                                this.setBlockState(emptyBlock, values);
                                // this.downSetEmptyBlock();
                            }
                            break;
                        }
                    }
                }
                // else this.downSetEmptyBlock()
            }
        }
        this.downSetEmptyBlock();
    }

    downSetEmptyBlock() {
        // console.log('downSetEmptyBlock');
        let total
        for (let j = 0; j < this.col; j++) {
            for (let i = this.row - 1; i >= 0; i--) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (this.blocksArr[k][j].numState) {
                            total = this.blocksArr[i][j].numState + this.blocksArr[k][j].numState;
                            const values = {
                                'total': total,
                                'block1': this.blocksArr[i][j],
                                'block2': this.blocksArr[k][j],
                            }
                            this.setEmptyBlockState(values);
                            break;
                        }
                    }
                }
            }
        }
        // this.addAtRandomPlace()

    }

    leftFindSameBlock() {
        // console.log('leftFindSameBlock');
        let total;
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = j + 1; k < this.col; k++) {
                        if (this.blocksArr[i][k].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[i][k].numState) {
                                total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                                const values = {
                                    'col': j,
                                    'total': total,
                                    'block1': this.blocksArr[i][j],
                                    'block2': this.blocksArr[i][k]
                                }
                                this.finalData.push(values)
                                let emptyBlock;
                                if (!emptyBlock) {
                                    emptyBlock = values.block1
                                    this.finalData.push(values.emptyBlock = emptyBlock)
                                }
                                // console.log(this.finalData);
                                this.setBlockState(emptyBlock, values);
                                // this.leftSetEmptyBlock();
                            }
                            break;
                        }
                    }
                }
                // else this.leftSetEmptyBlock()
            }
        }

        this.leftSetEmptyBlock();
    }

    leftSetEmptyBlock() {
        // console.log('leftSetEmptyBlock');
        // let total
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = j + 1; k < this.col; k++) {
                        if (this.blocksArr[i][k].numState > 0) {
                            console.log(i, j, i, k);
                            const total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                            const values = {
                                'total': total,
                                'block1': this.blocksArr[i][j],
                                'block2': this.blocksArr[i][k],
                            }
                            this.setEmptyBlockState(values);
                            break;
                        }
                    }
                }
            }
        }
        // this.addAtRandomPlace()

    }

    rightFindSameBlock() {
        let total;
        for (let i = 0; i < this.row; i++) {
            for (let j = this.col - 1; j >= 0; j--) {
                if (this.blocksArr[i][j].numState) {
                    for (let k = j - 1; k >= 0; k--) {
                        if (this.blocksArr[i][k].numState) {
                            if (this.blocksArr[i][j].numState === this.blocksArr[i][k].numState) {
                                total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                                const values = {
                                    'col': j,
                                    'total': total,
                                    'block1': this.blocksArr[i][j],
                                    'block2': this.blocksArr[i][k]
                                }
                                this.finalData.push(values)
                                let emptyBlock;
                                if (!emptyBlock) {
                                    emptyBlock = values.block1
                                    this.finalData.push(values.emptyBlock = emptyBlock)
                                }
                                // console.log(this.finalData);
                                this.setBlockState(emptyBlock, values);
                            }
                            // this.rightSetEmptyBlock();
                            break;
                        }
                    }
                }
                //  else this.rightSetEmptyBlock()
            }
        }
        this.rightSetEmptyBlock();
    }

    rightSetEmptyBlock() {
        console.log('rightSetEmptyBlock');
        let total
        for (let i = 0; i < this.row; i++) {
            for (let j = this.col - 1; j >= 0; j--) {
                if (this.blocksArr[i][j].numState === 0) {
                    for (let k = j - 1; k >= 0; k--) {
                        if (this.blocksArr[i][k].numState) {
                            total = this.blocksArr[i][j].numState + this.blocksArr[i][k].numState;
                            const values = {
                                'total': total,
                                'block1': this.blocksArr[i][j],
                                'block2': this.blocksArr[i][k],
                            }
                            this.setEmptyBlockState(values);
                            break;
                        }
                    }
                }
            }
        }
        // this.addAtRandomPlace()
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
        // console.log(em);
        let value = Phaser.Math.Between(0, emptyBlockArr.length - 1);
        emptyBlockArr[value].numState = 2;
        emptyBlockArr[value].setBlockText();
    }

    printTable(array2D, prop) {
        const arr = [];

        for (let i = 0; i < array2D.length; i++) {
            arr.push([]);
            for (let j = 0; j < array2D[i].length; j++) {
                if (array2D[i] && array2D[i][j])
                    arr[i].push(array2D[i][j][prop]);
            }
        }
        console.table(arr);
    }

    setBlockState(emptyBlock, values) {
        // console.log('setBlockState');
        values.block1.numState = 0
        values.block2.numState = 0
        emptyBlock.numState = values.total

        values.block1.setBlockText()
        values.block2.setBlockText()
        emptyBlock.setBlockText()
    }

    setEmptyBlockState(values) {
        // console.log('setEmptyBlockState');
        values.block1.numState = 0
        values.block2.numState = 0
        values.block1.numState = values.total

        values.block1.setBlockText()
        values.block2.setBlockText()

    }
}