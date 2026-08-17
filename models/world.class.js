/**
 * Energy a hit removes from the character. 20 corresponds exactly to one
 * section of the health bar so it visibly decreases with every hit.
 */
const CHARACTER_DAMAGE = 20;

/** Keeps all game objects together, draws them, and checks collisions. */
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  cameraX = 0;
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
   * Sets up the game world and starts drawing and game logic.
   * @param {HTMLCanvasElement} canvas - The canvas to draw on.
   * @param {Keyboard} keyboard - The object containing the currently pressed keys.
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

  /** Makes the world accessible to the character and end boss. */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.endboss = enemy;
      }
    });
  }

  /** Starts the loops that check collisions and the end of the game. */
  run() {
    setInterval(() => this.checkEnemyCollisions(), 200);
    setInterval(() => this.runGameLoop(), 1000 / 60);
  }

  /** Checks everything that changes quickly 60 times per second. */
  runGameLoop() {
    if (gamePaused) {
      return;
    }
    this.checkItemCollisions();
    this.checkThrowObjects();
    this.checkBottleHits();
    this.checkStompCollisions();
    this.removeFinishedBottles();
    this.checkGameOver();
  }

  /** Checks whether the character has died or defeated the end boss. */
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
   * Waits for the death animation to finish and then shows the end screen.
   * @param {number} delay - Delay in milliseconds.
   * @param {boolean} hasWon - true if the end boss was defeated.
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

  /** Checks whether the character touches an enemy. */
  checkEnemyCollisions() {
    if (gamePaused) {
      return;
    }
    this.level.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
  }

  /**
   * Damages the character when touching a living enemy from the side.
   * Immediately after a hit, the character is invulnerable for one second while
   * the hurt animation is playing. Otherwise, the character would take damage again every 200ms
   * and the hurt sound would overlap.
   * @param {MovableObject} enemy - The enemy to check.
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
   * Subtracts energy from the character. The end boss deals triple damage.
   * @param {MovableObject} enemy - The enemy causing the damage.
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

  /** Kills enemies that the character jumps on from above. */
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
   * Checks whether the character is currently jumping onto the enemy from above.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} true if the enemy is being stomped.
   */
  canStomp(enemy) {
    return (
      !(enemy instanceof Endboss) &&
      !enemy.isDead() &&
      this.character.isJumpingOn(enemy)
    );
  }

  /** Checks whether the character collects coins or bottles. */
  checkItemCollisions() {
    this.checkCoinCollisions();
    this.checkBottleCollisions();
  }

  /** Collects touched coins and updates the coin bar. */
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

  /** Collects touched bottles while the inventory is not full. */
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

  /** Throws a bottle when D is newly pressed. */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
    this.wasThrowKeyPressed = this.keyboard.D;
  }

  /**
   * Checks whether a bottle may currently be thrown.
   * @returns {boolean} true if a bottle is available and the cooldown has ended.
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

  /** Creates a flying bottle and subtracts it from the inventory. */
  throwBottle() {
    let x = this.character.x + 100;
    let y = this.character.y + 100;
    this.throwableObjects.push(new ThrowableObject(x, y));
    this.collectedBottles--;
    this.bottleStatusBar.setPercentage((this.collectedBottles / 5) * 100);
    this.lastThrow = new Date().getTime();
    playSound('throwBottle');
  }

  /** Checks whether a bottle still in flight hits an enemy. */
  checkBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isBroken) {
        return;
      }
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
          this.applyBottleHit(bottle, enemy);
        }
      });
    });
  }

  /**
   * Damages the hit enemy and breaks the bottle.
   * It is removed only after its splash animation has finished.
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @param {MovableObject} enemy - The enemy that was hit.
   */
  applyBottleHit(bottle, enemy) {
    bottle.breakBottle();
    enemy.hit();
    if (enemy instanceof Endboss) {
      this.endbossStatusBar.setPercentage((enemy.energy / 25) * 100);
      playSound('bossHurt');
    } else {
      this.removeDeadEnemy(enemy);
    }
  }

  /** Removes broken bottles once their animation has finished. */
  removeFinishedBottles() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isSplashFinished()) {
        bottle.stopIntervals();
        this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
      }
    });
  }

  /**
   * Removes an enemy only after one second so its
   * death animation remains visible.
   * @param {MovableObject} enemy - The defeated enemy.
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

  /** Draws a complete frame and requests the next one. */
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

  /** Draws the sky, landscape, and clouds with the camera offset. */
  drawBackground() {
    this.ctx.translate(this.cameraX, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.cameraX, 0);
  }

  /** Draws the status bars fixed at the top of the screen. */
  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if (this.endboss && this.endboss.isAlerted) {
      this.addToMap(this.endbossStatusBar);
    }
  }

  /** Draws the character, enemies, and objects with the camera offset. */
  drawGameObjects() {
    this.ctx.translate(this.cameraX, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.cameraX, 0);
  }

  /**
   * Draws all objects in a list.
   * @param {DrawableObject[]} objects - The objects to draw.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  /**
   * Draws an object and mirrors it if it faces left.
   * @param {DrawableObject} mo - The object to draw.
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
   * Mirrors the drawing area so the object faces left.
   * @param {DrawableObject} mo - The object to mirror.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the drawing state after mirroring.
   * @param {DrawableObject} mo - The mirrored object.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
