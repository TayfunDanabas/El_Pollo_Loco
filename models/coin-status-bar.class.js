/** Bilder der Muenzleiste von 0% bis 100%. */
const COIN_BAR_IMAGES = [
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
];

/** Statusleiste fuer die eingesammelten Muenzen. */
class CoinStatusBar extends StatusBar {
  /** Legt die Muenzleiste an, die leer startet. */
  constructor() {
    super(COIN_BAR_IMAGES, 0);
  }
}
