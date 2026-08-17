/**
 * Energie, die ein Treffer dem Charakter abzieht. 20 entspricht genau einem
 * Abschnitt der Lebensleiste, damit sie bei jedem Treffer sichtbar sinkt.
 */
const CHARACTER_DAMAGE = 20;

/** Haelt alle Objekte des Spiels zusammen, zeichnet sie und prueft Kollisionen. */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  bottleStatusBar = new BottleStatusBar();
  endbossStatusBar = new EndbossStatusBar();
  endboss;
  throwableObjects = [];
  collectedCoins = 0;
  collectedBottles = 0;
  wasThrowKeyPressed = false;
  lastThrow = 0;
  isRunning = true;
  gameEnded = false;
  showEndBackground = false;

  /**
   * Baut die Spielwelt auf und startet Zeichnen und Spiellogik.
   * @param {HTMLCanvasElement} canvas - Das Canvas, auf das gezeichnet wird.
   * @param {Keyboard} keyboard - Das Objekt mit den gedrueckten Tasten.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.coinStatusBar.y = 50;
    this.bottleStatusBar.y = 100;
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Macht die Welt fuer Charakter und Endboss erreichbar. */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.endboss = enemy;
      }
    });
  }

  /** Startet die Schleifen, die Kollisionen und das Spielende pruefen. */
  run() {
    setInterval(() => this.checkEnemyCollisions(), 200);
    setInterval(() => this.runGameLoop(), 1000 / 60);
  }

  /** Prueft 60 mal pro Sekunde alles, was sich schnell aendert. */
  runGameLoop() {
    if (gamePaused) {
      return;
    }
    this.checkItemCollisions();
    this.checkThrowObjects();
    this.checkBottleHits();
    this.checkStompCollisions();
    this.checkGameOver();
  }

  /** Prueft, ob der Charakter gestorben ist oder den Endboss besiegt hat. */
  checkGameOver() {
    if (this.gameEnded) {
      return;
    }
    if (this.character.isDead()) {
      this.gameEnded = true;
      this.waitThenShowEndScreen(600, false);
    } else if (this.endboss && this.endboss.isDead()) {
      this.gameEnded = true;
      this.waitThenShowEndScreen(900, true);
    }
  }

  /**
   * Wartet, bis die Sterbeanimation zu Ende ist, und zeigt dann den Endbildschirm.
   * @param {number} delay - Wartezeit in Millisekunden.
   * @param {boolean} hasWon - true, wenn der Endboss besiegt wurde.
   */
  waitThenShowEndScreen(delay, hasWon) {
    let timeLeft = delay;
    let interval = setInterval(() => {
      if (gamePaused) {
        return;
      }
      timeLeft -= 1000 / 60;
      if (timeLeft <= 0) {
        clearInterval(interval);
        showEndScreen(hasWon);
      }
    }, 1000 / 60);
  }

  /** Prueft, ob der Charakter einen Gegner beruehrt. */
  checkEnemyCollisions() {
    if (gamePaused) {
      return;
    }
    this.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
  }

  /**
   * Verletzt den Charakter, wenn er einen lebenden Gegner seitlich beruehrt.
   * Direkt nach einem Treffer ist er eine Sekunde lang unverwundbar, solange
   * die Verletzt-Animation laeuft. Sonst wuerde er alle 200ms erneut Schaden
   * nehmen und der Schmerz-Sound wuerde sich ueberschlagen.
   * @param {MovableObject} enemy - Der zu pruefende Gegner.
   */
  checkEnemyCollision(enemy) {
    if (this.character.isDead() || this.character.isHurt()) {
      return;
    }
    if (!this.character.isColliding(enemy) || enemy.isDead()) {
      return;
    }
    if (this.character.isJumpingOn(enemy)) {
      return;
    }
    this.hurtCharacter(enemy);
  }

  /**
   * Zieht dem Charakter Energie ab. Der Endboss macht dreifachen Schaden.
   * @param {MovableObject} enemy - Der Gegner, der den Schaden verursacht.
   */
  hurtCharacter(enemy) {
    let damage = CHARACTER_DAMAGE;
    if (enemy instanceof Endboss) {
      damage = CHARACTER_DAMAGE * 3;
    }
    this.character.hit(damage);
    playSound('hurt');
    this.statusBar.setPercentage(this.character.energy);
  }

  /** Toetet Gegner, auf die der Charakter von oben springt. */
  checkStompCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.canStomp(enemy)) {
        enemy.hit();
        this.character.bounce();
        this.removeDeadEnemy(enemy);
      }
    });
  }

  /**
   * Prueft, ob der Charakter gerade von oben auf den Gegner springt.
   * @param {MovableObject} enemy - Der zu pruefende Gegner.
   * @returns {boolean} true, wenn der Gegner zertreten wird.
   */
  canStomp(enemy) {
    return (
      !(enemy instanceof Endboss) &&
      !enemy.isDead() &&
      this.character.isJumpingOn(enemy)
    );
  }

  /** Prueft, ob der Charakter Muenzen oder Flaschen einsammelt. */
  checkItemCollisions() {
    this.checkCoinCollisions();
    this.checkBottleCollisions();
  }

  /** Sammelt beruehrte Muenzen ein und aktualisiert die Muenzleiste. */
  checkCoinCollisions() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(this.level.coins.indexOf(coin), 1);
        this.collectedCoins++;
        this.coinStatusBar.setPercentage((this.collectedCoins / 5) * 100);
        playSound('coin');
      }
    });
  }

  /** Sammelt beruehrte Flaschen ein, solange der Vorrat nicht voll ist. */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle) && this.collectedBottles < 5) {
        this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
        this.collectedBottles++;
        this.bottleStatusBar.setPercentage((this.collectedBottles / 5) * 100);
        playSound('bottleCollect');
      }
    });
  }

  /** Wirft eine Flasche, wenn D neu gedrueckt wurde. */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
    this.wasThrowKeyPressed = this.keyboard.D;
  }

  /**
   * Prueft, ob gerade eine Flasche geworfen werden darf.
   * @returns {boolean} true, wenn Vorrat da ist und die Pause vorbei ist.
   */
  canThrowBottle() {
    let timePassed = (new Date().getTime() - this.lastThrow) / 1000;
    return (
      this.keyboard.D &&
      !this.wasThrowKeyPressed &&
      this.collectedBottles > 0 &&
      timePassed > 0.5
    );
  }

  /** Erzeugt eine fliegende Flasche und zieht sie vom Vorrat ab. */
  throwBottle() {
    let x = this.character.x + 100;
    let y = this.character.y + 100;
    this.throwableObjects.push(new ThrowableObject(x, y));
    this.collectedBottles--;
    this.bottleStatusBar.setPercentage((this.collectedBottles / 5) * 100);
    this.lastThrow = new Date().getTime();
    playSound('throwBottle');
  }

  /** Prueft, ob eine geworfene Flasche einen Gegner trifft. */
  checkBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
          this.applyBottleHit(bottle, enemy);
        }
      });
    });
  }

  /**
   * Verletzt den getroffenen Gegner und entfernt die zerplatzte Flasche.
   * @param {ThrowableObject} bottle - Die geworfene Flasche.
   * @param {MovableObject} enemy - Der getroffene Gegner.
   */
  applyBottleHit(bottle, enemy) {
    enemy.hit();
    this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
    playSound('splash');
    if (enemy instanceof Endboss) {
      this.endbossStatusBar.setPercentage((enemy.energy / 25) * 100);
      playSound('bossHurt');
    } else {
      this.removeDeadEnemy(enemy);
    }
  }

  /**
   * Entfernt einen Gegner erst nach einer Sekunde, damit seine
   * Sterbeanimation noch zu sehen ist.
   * @param {MovableObject} enemy - Der besiegte Gegner.
   */
  removeDeadEnemy(enemy) {
    playSound('chickenDead');
    let timeLeft = 1000;
    let interval = setInterval(() => {
      if (gamePaused) {
        return;
      }
      timeLeft -= 1000 / 60;
      if (timeLeft <= 0) {
        clearInterval(interval);
        this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
      }
    }, 1000 / 60);
  }

  /** Zeichnet einen kompletten Frame und fordert den naechsten an. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    if (!this.showEndBackground) {
      this.drawStatusBars();
      this.drawGameObjects();
    }
    if (!this.isRunning) {
      return;
    }
    requestAnimationFrame(() => this.draw());
  }

  /** Zeichnet Himmel, Landschaft und Wolken mit Kameraversatz. */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  /** Zeichnet die Statusleisten fest am oberen Bildrand. */
  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if (this.endboss && this.endboss.isAlerted) {
      this.addToMap(this.endbossStatusBar);
    }
  }

  /** Zeichnet Charakter, Gegner und Gegenstaende mit Kameraversatz. */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Zeichnet alle Objekte einer Liste.
   * @param {DrawableObject[]} objects - Die zu zeichnenden Objekte.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  /**
   * Zeichnet ein Objekt und spiegelt es, wenn es nach links schaut.
   * @param {DrawableObject} mo - Das zu zeichnende Objekt.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Spiegelt den Zeichenbereich, damit das Objekt nach links schaut.
   * @param {DrawableObject} mo - Das zu spiegelnde Objekt.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Hebt die Spiegelung wieder auf.
   * @param {DrawableObject} mo - Das gespiegelte Objekt.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
