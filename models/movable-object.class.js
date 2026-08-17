/** Upward speed a jump starts with. */
const JUMP_SPEED = 13;

/** Base class for all objects that can move and take damage. */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.45;
  energy = 100;
  lastHit = 0;
  groundY = 180;
  landsOnGround = true;

  /**
   * Makes the object fall while it is above the ground. Runs 60 times per
   * second so the jump looks smooth. On landing the object is placed exactly
   * on the ground, otherwise it would stop wherever the last step left it.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (gamePaused) {
        return;
      }
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else if (this.landsOnGround) {
        this.y = this.groundY;
        this.speedY = 0;
      }
    }, 1000 / 60);
  }

  /**
   * Checks whether the object is in the air.
   * Thrown bottles keep falling until they burst.
   * @returns {boolean} true if the object is not standing on the ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return !this.isBroken;
    } else {
      return this.y < this.groundY;
    }
  }

  /**
   * Checks whether this object overlaps another object. Both hit areas are
   * shrunk by their offsets, so a collision needs a real visual overlap.
   * @param {DrawableObject} mo - The other object.
   * @returns {boolean} true if a collision occurs.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offsetRight > mo.x + mo.offsetLeft &&
      this.y + this.height - this.offsetBottom > mo.y + mo.offsetTop &&
      this.x + this.offsetLeft < mo.x + mo.width - mo.offsetRight &&
      this.y + this.offsetTop < mo.y + mo.height - mo.offsetBottom
    );
  }

  /**
   * Checks whether this object is jumping onto another object from above.
   * @param {DrawableObject} mo - The other object.
   * @returns {boolean} true if it is hit from above while falling.
   */
  isJumpingOn(mo) {
    return (
      this.isColliding(mo) &&
      this.isAboveGround() &&
      this.speedY < 0 &&
      this.y + this.height - this.offsetBottom < mo.y + mo.height - mo.offsetBottom
    );
  }

  /**
   * Subtracts energy from the object and records the time of the hit.
   * @param {number} [damage] - Energy to subtract. Defaults to 5.
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks whether the last hit occurred less than one second ago.
   * @returns {boolean} true while the hurt animation should play.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Checks whether the energy is depleted.
   * @returns {boolean} true if the object has no energy left.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Displays the next image in a sequence to create an animation.
   * @param {string[]} images - Paths to the images for this animation.
   */
  playAnimation(images) {
    if (gamePaused) {
      return;
    }
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /** Moves the object to the right by its speed. */
  moveRight() {
    if (gamePaused) {
      return;
    }
    this.x += this.speed;
  }

  /** Moves the object to the left by its speed. */
  moveLeft() {
    if (gamePaused) {
      return;
    }
    this.x -= this.speed;
  }

  /** Gives the object upward momentum for a jump. */
  jump() {
    this.speedY = JUMP_SPEED;
  }

  /** Makes the object bounce back after jumping on an enemy. */
  bounce() {
    this.speedY = 8.7;
  }
}
