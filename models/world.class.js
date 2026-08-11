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

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        this.endboss = enemy;
      }
    });
  }

  run() {
    setInterval(() => {
      this.checkEnemyCollisions();
    }, 200);

    setInterval(() => {
      this.checkItemCollisions();
      this.checkThrowObjects();
      this.checkBottleHits();
      this.checkStompCollisions();
    }, 1000 / 60);
  }

  checkThrowObjects() {
    let timePassed = (new Date().getTime() - this.lastThrow) / 1000;
    if (
      this.keyboard.D &&
      !this.wasThrowKeyPressed &&
      this.collectedBottles > 0 &&
      timePassed > 0.5
    ) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      this.collectedBottles--;
      this.bottleStatusBar.setPercentage((this.collectedBottles / 5) * 100);
      this.lastThrow = new Date().getTime();
    }
    this.wasThrowKeyPressed = this.keyboard.D;
  }

  checkBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
          enemy.hit();
          this.throwableObjects.splice(
            this.throwableObjects.indexOf(bottle),
            1,
          );
          if (enemy instanceof Endboss) {
            this.endbossStatusBar.setPercentage((enemy.energy / 25) * 100);
          } else {
            this.removeDeadEnemy(enemy);
          }
        }
      });
    });
  }

  checkStompCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (
        !(enemy instanceof Endboss) &&
        !enemy.isDead() &&
        this.character.isJumpingOn(enemy)
      ) {
        enemy.hit();
        this.character.bounce();
        this.removeDeadEnemy(enemy);
      }
    });
  }

  removeDeadEnemy(enemy) {
    setTimeout(() => {
      this.level.enemies.splice(this.level.enemies.indexOf(enemy), 1);
    }, 1000);
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        !enemy.isDead() &&
        !this.character.isJumpingOn(enemy)
      ) {
        if (enemy instanceof Endboss) {
          this.character.hit();
          this.character.hit();
          this.character.hit();
        } else {
          this.character.hit();
        }
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkItemCollisions() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(this.level.coins.indexOf(coin), 1);
        this.collectedCoins++;
        this.coinStatusBar.setPercentage((this.collectedCoins / 5) * 100);
      }
    });

    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle) && this.collectedBottles < 5) {
        this.level.bottles.splice(this.level.bottles.indexOf(bottle), 1);
        this.collectedBottles++;
        this.bottleStatusBar.setPercentage((this.collectedBottles / 5) * 100);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);
    // ---------- Space for fixed Objects ----------
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if (this.endboss && this.endboss.isAlerted) {
      this.addToMap(this.endbossStatusBar);
    }
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    // draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
