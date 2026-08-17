/** Images for the bottle bar from 0% to 100%. */
const BOTTLE_BAR_IMAGES = [
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
  'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
];

/** Status bar for the collected salsa bottles. */
class BottleStatusBar extends StatusBar {
  /** Creates the bottle bar, which starts empty. */
  constructor() {
    super(BOTTLE_BAR_IMAGES, 0);
  }
}
