/** Eine geworfene Salsaflasche, die im Bogen fliegt und Gegner trifft. */
class ThrowableObject extends MovableObject {
  height = 60;
  width = 50;

  /**
   * Startet den Wurf an der Position des Charakters.
   * @param {number} x - Startposition auf der x-Achse.
   * @param {number} y - Startposition auf der y-Achse.
   */
  constructor(x, y) {
    super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.throw();
  }

  /** Gibt der Flasche Schwung nach oben und laesst sie nach rechts fliegen. */
  throw() {
    this.speedY = 10;
    this.applyGravity();
    setInterval(() => {
      if (gamePaused) {
        return;
      }
      this.x += 12;
    }, 25);
  }
}
