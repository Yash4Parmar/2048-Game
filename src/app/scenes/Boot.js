import assets from '../data/assets.js';

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    const sprites = assets.sprites;
    for (const sprite of sprites.PNGs) {
      const fullPath = `${sprites.pathPrefix + sprite}.png`;
      this.load.image(sprite, fullPath);
    }

    for (const sprite of sprites.JPGs) {
      const fullPath = `${sprites.pathPrefix + sprite}.jpg`;
      this.load.image(sprite, fullPath);
    }

    const sounds = assets.sounds;
    for (const sound of sounds.list) {
      const fullPath = `${sounds.pathPrefix + sound}.mp3`;
      this.load.audio(sound, fullPath);
    }
  }

  create() {
    this.scene.start('Home');
  }
}
