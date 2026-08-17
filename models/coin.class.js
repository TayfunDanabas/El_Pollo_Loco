/** Eine Muenze, die der Charakter einsammeln kann. */
class Coin extends DrawableObject {
  width = 100;
  height = 100;

  IMAGES = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  /**
   * Setzt die Muenze mit zufaelligem Versatz und zufaelliger Hoehe ins Level.
   * @param {number} x - Ungefaehre Startposition im Level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x + Math.random() * 100;
    this.y = 50 + Math.random() * 150;
  }
}
