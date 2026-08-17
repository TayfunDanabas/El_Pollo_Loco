/** Groups all objects of a level together. */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  levelEndX = 4400;

  /**
   * Defines the content of the level.
   * @param {MovableObject[]} enemies - All enemies, including the end boss.
   * @param {Cloud[]} clouds - The clouds in the sky.
   * @param {BackgroundObject[]} backgroundObjects - The background layers.
   * @param {Coin[]} coins - The collectible coins.
   * @param {Bottle[]} bottles - The collectible salsa bottles.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
