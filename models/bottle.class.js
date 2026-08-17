/** A salsa bottle that lies on the ground and can be collected. */
class Bottle extends DrawableObject {
  width = 100;
  height = 100;
  y = 350;

  IMAGES = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  /**
   * Places the bottle in the level with a random offset.
   * @param {number} x - Approximate starting position in the level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = x + Math.random() * 100;
  }
}
