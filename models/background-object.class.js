/** A background layer that moves along with the camera. */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Sets the image and position of a background layer.
   * @param {string} imagePath - Path to the layer image file.
   * @param {number} x - Position of the layer in the level.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
