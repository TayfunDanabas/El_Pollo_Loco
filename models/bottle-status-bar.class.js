/** Bilder der Flaschenleiste von 0% bis 100%. */
const BOTTLE_BAR_IMAGES = [
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
];

/** Statusleiste fuer die eingesammelten Salsaflaschen. */
class BottleStatusBar extends StatusBar {
  /** Legt die Flaschenleiste an, die leer startet. */
  constructor() {
    super(BOTTLE_BAR_IMAGES, 0);
  }
}
