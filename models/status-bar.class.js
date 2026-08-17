/** Bilder der Lebensleiste von 0% bis 100%. */
const HEALTH_BAR_IMAGES = [
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
];

/**
 * Statusleiste am oberen Bildrand. Zeigt einen Fuellstand ueber sechs Bilder an.
 * Ohne Angabe zeigt sie die Lebensenergie des Charakters.
 */
class StatusBar extends DrawableObject {
  IMAGES = HEALTH_BAR_IMAGES;
  percentage = 100;
  x = 30;
  y = 0;
  width = 200;
  height = 60;

  /**
   * Laedt die Bilder der Leiste und setzt den Startfuellstand.
   * @param {string[]} [images] - Die sechs Bilder von 0% bis 100%.
   * @param {number} [percentage] - Startfuellstand von 0 bis 100.
   */
  constructor(images = HEALTH_BAR_IMAGES, percentage = 100) {
    super();
    this.IMAGES = images;
    this.loadImages(images);
    this.setPercentage(percentage);
  }

  /**
   * Setzt den Fuellstand und waehlt das passende Bild dazu aus.
   * @param {number} percentage - Fuellstand von 0 bis 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.img = this.imageCache[this.IMAGES[this.resolveImageIndex()]];
  }

  /**
   * Ermittelt, welches der sechs Bilder zum aktuellen Fuellstand passt.
   * @returns {number} Index im IMAGES-Array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
