
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
        this.graphicsRect = this.scene.add.graphics({ x: dimensions.width / 2 - 100 * 3.5 + this.j * 130 + 65, y: dimensions.height * 0.45 - 75 * 3.5 + this.i * 130 + 65 })
        this.graphicsRect.fillStyle(colorData[this.numState], 0.5);
        this.graphicsRect.fillRect(-65, -65, 130, 130);
        this.graphicsRect.lineStyle(3, 0x1C3AA9, 1);
        // this.graphicsRect.strokeRect(-65, -65, 130, 130);
    }

    addText() {
        let blockText
        if (this.numState) {
            blockText = this.numState
        } else {
            blockText = '';
        }
        this.blockText = this.scene.add.text(this.graphicsRect.x, this.graphicsRect.y, blockText, {
            fontFamily: 'Arial',
            fontSize: 40,
            color: '#000000',
        }).setOrigin(0.5).setDepth(1);
    }

    clearColor() {
        this.graphicsRect.fillStyle(colorData[0], 1);
        this.graphicsRect.fillRect(-65, -65, 130, 130);
        this.blockText.setText('');
    }


    setBlockText() {
        if (this.numState === 0) {
            this.blockText.setText('');
        } else {
            this.blockText.setText(this.numState);
        }
    }

    destroy() {
        this.graphicsRect.destroy()
        this.blockText.destroy()
    }

    copyGraphics() {
        this.graphicsRect.fillStyle(colorData[this.numState], 0.5);
        this.graphicsRect.fillRect(-65, -65, 130, 130);
        // this.graphicsRect.lineStyle(3, 0x1C3AA9, 1);
    }

}