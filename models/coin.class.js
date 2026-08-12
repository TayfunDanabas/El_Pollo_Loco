class Coin extends DrawableObject {
  IMAGES = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  width = 100;
  height = 100;

  constructor(x) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x + Math.random() * 100;
    this.y = 50 + Math.random() * 150;
  }
}
