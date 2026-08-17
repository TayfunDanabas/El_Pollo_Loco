/** A coin that the character can collect. */
class Coin extends DrawableObject {
  width = 100;
  height = 100;
  offsetLeft = 28;
  offsetRight = 28;
  offsetTop = 20;
  offsetBottom = 25;

  IMAGES = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  /**
   * Places the coin in the level with a random offset and random height.
   * @param {number} x - Approximate starting position in the level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x + Math.random() * 100;
    this.y = 50 + Math.random() * 150;
  }
}
