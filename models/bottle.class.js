/** Eine Salsaflasche, die am Boden liegt und eingesammelt werden kann. */
class Bottle extends DrawableObject {
  width = 100;
  height = 100;
  y = 350;

  IMAGES = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  /**
   * Setzt die Flasche mit zufaelligem Versatz ins Level.
   * @param {number} x - Ungefaehre Startposition im Level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x + Math.random() * 100;
  }
}
