/** Images for the end boss bar from 0% to 100%. */
const ENDBOSS_BAR_IMAGES = [
  'img/7_statusbars/2_statusbar_endboss/green/green0.png',
  'img/7_statusbars/2_statusbar_endboss/green/green20.png',
  'img/7_statusbars/2_statusbar_endboss/green/green40.png',
  'img/7_statusbars/2_statusbar_endboss/green/green60.png',
  'img/7_statusbars/2_statusbar_endboss/green/green80.png',
  'img/7_statusbars/2_statusbar_endboss/green/green100.png',
];

/** Status bar for the end boss's energy, shown at the top right. */
class EndbossStatusBar extends StatusBar {
  x = 500;

  /** Creates the end boss bar, which starts full. */
  constructor() {
    super(ENDBOSS_BAR_IMAGES, 100);
  }
}
