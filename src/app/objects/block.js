
// import { Tweens } from "phaser";
import dimensions from "../../config/dimensions.js";
import blockData from "../data/block-data.js";
import colorData from "../data/color-data.js";

export default class Block {
    constructor(scene, i, j, blockData) {
        this.scene = scene;
        this.i = i;
        this.j = j;
        this.numState = blockData;
        this.x = dimensions.width / 2 - 75 * 3.5 + this.j * 130
        this.y = dimensions.height * 0.45 - 45 * 3.5 + this.i * 130

        this.init();
        this.addText()
    }

    init() {
        this.graphicsRect = this.scene.add.graphics({ x: dimensions.width / 2 - 100 * 3.5 + this.j * 130, y: dimensions.height * 0.45 - 75 * 3.5 + this.i * 130 })
        // this.graphicsRect.setOrigin(0.5);
        // this.graphicsRect.displayOriginX = 0.5
        // this.graphicsRect.displayOriginY = 0.5
        // console.log(this.graphicsRect.displayOriginX);
        this.graphicsRect.lineStyle(3, 0x1C3AA9, 1);
        this.graphicsRect.strokeRect(0, 0, 130, 130);
    }

    addText() {
        let blockText
        if (this.numState) {
            blockText = this.numState
        } else {
            blockText = '';
        }
        this.text = this.scene.add.text(this.graphicsRect.x + 65, this.graphicsRect.y + 65, blockText, {
            fontFamily: 'Arial',
            fontSize: 40,
            color: '#000000',
            // align: 'center'
        }).setOrigin(0.5).setDepth(2);

        this.scene.index++;
    }

    setBlockText() {
        if (this.numState === 0) {
            this.text.setText('');
        } else {
            this.text.setText(this.numState);
        }
    }

}