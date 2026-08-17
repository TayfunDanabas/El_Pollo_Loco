/** Images for the coin bar from 0% to 100%. */
const COIN_BAR_IMAGES = [
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
  'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
];

/** Status bar for the collected coins. */
class CoinStatusBar extends StatusBar {
  /** Creates the coin bar, which starts empty. */
  constructor() {
    super(COIN_BAR_IMAGES, 0);
  }
}
