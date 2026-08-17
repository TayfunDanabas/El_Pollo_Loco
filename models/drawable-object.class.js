/** Basisklasse fuer alles, was auf das Canvas gezeichnet wird. */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;
  offsetY = 0;

  /**
   * Laedt das Bild, das aktuell gezeichnet wird.
   * @param {string} path - Pfad zur Bilddatei.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Laedt mehrere Bilder in den Cache, damit Animationen ruckelfrei laufen.
   * @param {string[]} paths - Pfade zu den Bilddateien.
   */
  loadImages(paths) {
    paths.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Zeichnet das aktuelle Bild an seine Position auf dem Canvas.
   * @param {CanvasRenderingContext2D} ctx - Zeichenkontext des Canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
