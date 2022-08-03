export default class Home extends Phaser.Scene {
  constructor() {
    super({ key: 'Home' });
  }

  create() {
    // this.add.sprite(0, 0, 'sky');
    this.scene.start('gameplay');
  }

  update() { }
}
