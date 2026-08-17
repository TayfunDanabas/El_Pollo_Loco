/** Fasst alle Objekte eines Levels zusammen. */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  levelEndX = 4400;

  /**
   * Legt den Inhalt des Levels fest.
   * @param {MovableObject[]} enemies - Alle Gegner inklusive Endboss.
   * @param {Cloud[]} clouds - Die Wolken am Himmel.
   * @param {BackgroundObject[]} backgroundObjects - Die Hintergrundebenen.
   * @param {Coin[]} coins - Die einsammelbaren Muenzen.
   * @param {Bottle[]} bottles - Die einsammelbaren Salsaflaschen.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
