
import dimensions from "../../config/dimensions.js";
import blockData from "../data/block-data.js";

export default class Block {
    constructor(scene, i, j, blockData) {
        this.scene = scene;
        this.i = i;
        this.j = j;
        this.numState = blockData;
        // this.numState = 0;
        // this.debug = true;

        // this.blockData = blockData.arr;

        this.init();
        this.addText()
    }

    init() {
        this.graphicsRect = this.scene.add.graphics({ x: dimensions.width / 2 - 100 * 3.5 + this.j * 130, y: dimensions.height * 0.45 - 75 * 3.5 + this.i * 130 }).setInteractive();
        this.graphicsRect.lineStyle(3, 0x1C3AA9, 1);
        this.graphicsRect.strokeRect(0, 0, 130, 130);
        // this.graphicsRect.fillStyle(0x1C3AA9, 0);
        // this.graphicsRect.fillRect(0, 0, 130, 130);

        this.graphicsRect.setInteractive(new Phaser.Geom.Rectangle(0, 0, 130, 130), Phaser.Geom.Rectangle.Contains).on('pointerdown', (pointer, localX, localY, event) => {
            console.log(this.i, this.j);
            // console.log(this.numState);

        });
        if (this.debug) {
            const text = this.scene.add.text(this.graphicsRect.x + 65, this.graphicsRect.y + 65, this.scene.index, {
                fontFamily: 'Arial',
                fontSize: 40,
                color: '#000000',
                // align: 'center'
            }).setOrigin(0.5);
            this.scene.index++;
        }


    }

    addText() {
        if (this.numState) {
            // this.numState = this.blockData;
            this.text = this.scene.add.text(this.graphicsRect.x + 65, this.graphicsRect.y + 65, this.numState, {
                fontFamily: 'Arial',
                fontSize: 40,
                color: '#000000',
                // align: 'center'
            }).setOrigin(0.5);
            // console.log(this.numState);
        } else {
            this.text = this.scene.add.text(this.graphicsRect.x + 65, this.graphicsRect.y + 65, '', {
                fontFamily: 'Arial',
                fontSize: 40,
                color: '#000000',
                // align: 'center'
            }).setOrigin(0.5);
            // this.numState = 0;
        }
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