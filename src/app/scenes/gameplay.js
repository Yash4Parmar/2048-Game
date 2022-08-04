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
        this.blockData = blockData.arr;


        for (let i = 0; i < this.row; i++) {
            this.blocksArr[i] = [];
            for (let j = 0; j < this.col; j++) {
                this.block = new Block(this, i, j, this.blockData[i][j]);
                this.blocksArr[i].push(this.block);
            }
        }
        console.log(this.blocksArr);
        this.input.keyboard.on('keydown-' + 'UP', this.onPress, this);
        this.input.keyboard.on('keydown-' + 'LEFT', this.onPress, this);
        this.input.keyboard.on('keydown-' + 'RIGHT', this.onPress, this);
        this.input.keyboard.on('keydown-' + 'DOWN', this.onPress, this);

    }
    onPress() {
        this.findSameBlock();
    }

    findSameBlock() {
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
                                let emptyBlock;
                                if (!emptyBlock) {
                                    emptyBlock = values.block1
                                }
                                this.setBlockState(emptyBlock, values);
                                this.setBlock()
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    setBlock() {
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
                        }
                        break;
                    }
                }
            }
        }
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
        values.block1.numState = 0
        values.block2.numState = 0
        emptyBlock.numState = values.total

        values.block1.setBlockText(values.block1.numState)
        values.block2.setBlockText(values.block2.numState)
        emptyBlock.setBlockText(emptyBlock.numState)

    }
    setEmptyBlockState(values) {
        values.block1.numState = values.total
        values.block2.numState = 0
        // emptyBlock.numState = values.total

        values.block1.setBlockText(values.block1.numState)
        values.block2.setBlockText(values.block2.numState)
        // emptyBlock.setBlockText(emptyBlock.numState)

    }
}