/**
 * Das Level, das initLevel() zusammenbaut und das die Welt danach nutzt.
 * @type {Level}
 */
let level1;

/** Baut das Level aus Gegnern, Wolken, Hintergrund, Muenzen und Flaschen auf. */
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
 * Erzeugt 20 Huehner im Wechsel von gross und klein sowie den Endboss.
 * @returns {MovableObject[]} Alle Gegner des Levels.
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
 * Erzeugt die Wolken am Himmel.
 * @returns {Cloud[]} Alle Wolken des Levels.
 */
function createClouds() {
  let clouds = [];
  for (let i = 0; i < 8; i++) {
    clouds.push(new Cloud());
  }
  return clouds;
}

/**
 * Setzt den Hintergrund aus neun Abschnitten zusammen. Die Abschnitte grenzen
 * lueckenlos aneinander, weil jede Grafik 719px breit ist.
 * @returns {BackgroundObject[]} Alle Hintergrundebenen des Levels.
 */
function createBackgroundObjects() {
  let objects = [];
  for (let i = -1; i < 8; i++) {
    objects = objects.concat(createBackgroundLayers(i));
  }
  return objects;
}

/**
 * Erzeugt die vier Ebenen eines Hintergrundabschnitts.
 * @param {number} index - Nummer des Abschnitts, jeder ist 719px breit.
 * @returns {BackgroundObject[]} Die vier Ebenen des Abschnitts.
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
 * Baut den Pfad zu einer Hintergrundgrafik zusammen.
 * @param {string} name - Dateiname ohne Endung, bei Bedarf mit Unterordner.
 * @returns {string} Vollstaendiger Pfad zur Bilddatei.
 */
function backgroundPath(name) {
  return 'img/5_background/layers/' + name + '.png';
}

/**
 * Verteilt die Muenzen gleichmaessig ueber das Level.
 * @returns {Coin[]} Alle Muenzen des Levels.
 */
function createCoins() {
  let coins = [];
  for (let i = 0; i < 5; i++) {
    coins.push(new Coin(600 + i * 800));
  }
  return coins;
}

/**
 * Verteilt die Salsaflaschen gleichmaessig ueber das Level.
 * @returns {Bottle[]} Alle Flaschen des Levels.
 */
function createBottles() {
  let bottles = [];
  for (let i = 0; i < 16; i++) {
    bottles.push(new Bottle(400 + i * 250));
  }
  return bottles;
}
