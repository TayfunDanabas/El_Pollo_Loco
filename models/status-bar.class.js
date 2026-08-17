/** Images for the health bar from 0% to 100%. */
const HEALTH_BAR_IMAGES = [
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
  'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
];

/**
 * Status bar at the top of the screen. Displays a fill level using six images.
 * By default, it displays the character's health.
 */
class StatusBar extends DrawableObject {
  IMAGES = HEALTH_BAR_IMAGES;
  percentage = 100;
  x = 30;
  y = 0;
  width = 200;
  height = 60;

  /**
   * Loads the bar images and sets the initial fill level.
   * @param {string[]} [images] - The six images from 0% to 100%.
   * @param {number} [percentage] - Initial fill level from 0 to 100.
   */
  constructor(images = HEALTH_BAR_IMAGES, percentage = 100) {
    super();
    this.IMAGES = images;
    this.loadImages(images);
    this.setPercentage(percentage);
  }

  /**
   * Sets the fill level and selects the matching image.
   * @param {number} percentage - Fill level from 0 to 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.img = this.imageCache[this.IMAGES[this.resolveImageIndex()]];
  }

  /**
   * Determines which of the six images matches the current fill level.
   * @returns {number} Index in the IMAGES array.
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
