/** Bilder der Endboss-Leiste von 0% bis 100%. */
const ENDBOSS_BAR_IMAGES = [
  'img/7_statusbars/2_statusbar_endboss/green/green0.png',
  'img/7_statusbars/2_statusbar_endboss/green/green20.png',
  'img/7_statusbars/2_statusbar_endboss/green/green40.png',
  'img/7_statusbars/2_statusbar_endboss/green/green60.png',
  'img/7_statusbars/2_statusbar_endboss/green/green80.png',
  'img/7_statusbars/2_statusbar_endboss/green/green100.png',
];

/** Statusleiste fuer die Energie des Endbosses, rechts oben im Bild. */
class EndbossStatusBar extends StatusBar {
  x = 500;

  /** Legt die Endboss-Leiste an, die voll startet. */
  constructor() {
    super(ENDBOSS_BAR_IMAGES, 100);
  }
}
