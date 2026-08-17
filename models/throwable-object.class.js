/** Height at which a thrown bottle hits the ground. */
const BOTTLE_GROUND_Y = 360;

/** A thrown salsa bottle that flies in an arc and bursts on impact. */
class ThrowableObject extends MovableObject {
  height = 60;
  width = 50;
  isBroken = false;
  splashFrame = 0;
  gravityInterval;
  flightInterval;
  animationInterval;

  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /**
   * Starts the throw at the character's position.
   * @param {number} x - Starting position on the x-axis.
   * @param {number} y - Starting position on the y-axis.
   */
  constructor(x, y) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.throw();
    this.animate();
  }

  /** Gives the bottle upward momentum and makes it fly to the right. */
  throw() {
    this.speedY = 10;
    this.applyGravity();
    this.flightInterval = setInterval(() => {
      if (gamePaused || this.isBroken) {
        return;
      }
      this.x += 12;
      this.checkGroundHit();
    }, 25);
  }

  /** Breaks the bottle as soon as it reaches the ground. */
  checkGroundHit() {
    if (this.y > BOTTLE_GROUND_Y) {
      this.breakBottle();
    }
  }

  /** Breaks the bottle and plays the breaking sound. */
  breakBottle() {
    if (this.isBroken) {
      return;
    }
    this.isBroken = true;
    this.speedY = 0;
    playSound('bottleBreak');
  }

  /** Rotates the bottle during flight and then shows the splash animation. */
  animate() {
    this.animationInterval = setInterval(() => {
      if (gamePaused) {
        return;
      }
      if (this.isBroken) {
        this.playSplashAnimation();
      } else {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 50);
  }

  /** Plays the splash animation once through the final frame. */
  playSplashAnimation() {
    if (this.isSplashFinished()) {
      return;
    }
    this.img = this.imageCache[this.IMAGES_SPLASH[this.splashFrame]];
    this.splashFrame++;
  }

  /**
   * Checks whether the splash animation has finished.
   * @returns {boolean} true if the bottle can be removed.
   */
  isSplashFinished() {
    return this.splashFrame >= this.IMAGES_SPLASH.length;
  }

  /** Stops all loops so nothing continues running after removal. */
  stopIntervals() {
    clearInterval(this.gravityInterval);
    clearInterval(this.flightInterval);
    clearInterval(this.animationInterval);
  }
}
