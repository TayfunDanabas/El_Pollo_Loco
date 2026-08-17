/**
 * The level built by initLevel() and then used by the game world.
 * @type {Level}
 */
let level1;

/** Builds the level from enemies, clouds, background objects, coins, and bottles. */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles(),
  );
}

/**
 * Creates 20 chickens alternating between large and small, plus the end boss.
 * @returns {MovableObject[]} All enemies in the level.
 */
function createEnemies() {
  let enemies = [];
  for (let i = 0; i < 20; i++) {
    if (i % 2 === 0) {
      enemies.push(new Chicken(800 + i * 200));
    } else {
      enemies.push(new ChickenSmall(800 + i * 200));
    }
  }
  enemies.push(new Endboss());
  return enemies;
}

/**
 * Creates the clouds in the sky.
 * @returns {Cloud[]} All clouds in the level.
 */
function createClouds() {
  let clouds = [];
  for (let i = 0; i < 8; i++) {
    clouds.push(new Cloud());
  }
  return clouds;
}

/**
 * Builds the background from nine sections. The sections connect seamlessly
 * because each graphic is 719px wide.
 * @returns {BackgroundObject[]} All background layers in the level.
 */
function createBackgroundObjects() {
  let objects = [];
  for (let i = -1; i < 8; i++) {
    objects = objects.concat(createBackgroundLayers(i));
  }
  return objects;
}

/**
 * Creates the four layers of a background section.
 * @param {number} index - Number of the section, each one is 719px wide.
 * @returns {BackgroundObject[]} The four layers of the section.
 */
function createBackgroundLayers(index) {
  let x = 719 * index;
  let variant = '2';
  if (index % 2 === 0) {
    variant = '1';
  }
  return [
    new BackgroundObject(backgroundPath('air'), x),
    new BackgroundObject(backgroundPath('3_third_layer/' + variant), x),
    new BackgroundObject(backgroundPath('2_second_layer/' + variant), x),
    new BackgroundObject(backgroundPath('1_first_layer/' + variant), x),
  ];
}

/**
 * Builds the path to a background graphic.
 * @param {string} name - File name without extension, including a subfolder if needed.
 * @returns {string} Complete path to the image file.
 */
function backgroundPath(name) {
  return 'img/5_background/layers/' + name + '.png';
}

/**
 * Distributes the coins evenly throughout the level.
 * @returns {Coin[]} All coins in the level.
 */
function createCoins() {
  let coins = [];
  for (let i = 0; i < 5; i++) {
    coins.push(new Coin(600 + i * 800));
  }
  return coins;
}

/**
 * Distributes the salsa bottles evenly throughout the level.
 * @returns {Bottle[]} All bottles in the level.
 */
function createBottles() {
  let bottles = [];
  for (let i = 0; i < 16; i++) {
    bottles.push(new Bottle(400 + i * 250));
  }
  return bottles;
}
