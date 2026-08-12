class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (gamePaused) {
        return;
      }
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Throwable objects should always fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  // character.isColliding(chicken);
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y + mo.offsetY &&
      this.x < mo.x + mo.width &&
      this.y + this.offsetY < mo.y + mo.height
    );
  }

  // character.isJumpingOn(chicken);
  isJumpingOn(mo) {
    return (
      this.isColliding(mo) &&
      this.isAboveGround() &&
      this.speedY < 0 &&
      this.y + this.height < mo.y + mo.height
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed / 1000; // Difference in s
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    if (gamePaused) {
      return;
    }
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    if (gamePaused) {
      return;
    }
    this.x += this.speed;
  }
  moveLeft() {
    if (gamePaused) {
      return;
    }
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }

  bounce() {
    this.speedY = 20;
  }
}
