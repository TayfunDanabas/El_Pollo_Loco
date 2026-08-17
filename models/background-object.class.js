/** Eine Ebene des Hintergrunds, die sich mit der Kamera mitbewegt. */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Legt Bild und Position einer Hintergrundebene fest.
   * @param {string} imagePath - Pfad zur Bilddatei der Ebene.
   * @param {number} x - Position der Ebene im Level.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
