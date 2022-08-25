import Boot from '../app/scenes/Boot.js';
import gameplay from '../app/scenes/gameplay.js';
import Home from '../app/scenes/Home.js';
import dimensions from './dimensions.js';

export default {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: dimensions.width,
    height: dimensions.height
  },
  scene: [Boot, Home, gameplay],
  backgroundColor: 0xffffff,

};
