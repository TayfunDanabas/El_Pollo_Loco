/** Hoehe, ab der eine geworfene Flasche auf dem Boden aufschlaegt. */
const BOTTLE_GROUND_Y = 360;

/** Eine geworfene Salsaflasche, die im Bogen fliegt und beim Aufprall zerplatzt. */
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
   * Startet den Wurf an der Position des Charakters.
   * @param {number} x - Startposition auf der x-Achse.
   * @param {number} y - Startposition auf der y-Achse.
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

  /** Gibt der Flasche Schwung nach oben und laesst sie nach rechts fliegen. */
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

  /** Laesst die Flasche zerplatzen, sobald sie den Boden erreicht. */
  checkGroundHit() {
    if (this.y > BOTTLE_GROUND_Y) {
      this.breakBottle();
    }
  }

  /**
   * Eine fliegende Flasche faellt immer. Erst wenn sie zerplatzt ist, bleibt
   * sie liegen und die Schwerkraft laesst sie in Ruhe.
   * @returns {boolean} true, solange die Flasche noch fliegt.
   */
  isAboveGround() {
    return !this.isBroken;
  }

  /** Laesst die Flasche zerplatzen und spielt den Bruchsound. */
  breakBottle() {
    if (this.isBroken) {
      return;
    }
    this.isBroken = true;
    this.speedY = 0;
    playSound('bottleBreak');
  }

  /** Dreht die Flasche im Flug und zeigt danach das Zerplatzen. */
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

  /** Spielt das Zerplatzen einmalig bis zum letzten Bild ab. */
  playSplashAnimation() {
    if (this.isSplashFinished()) {
      return;
    }
    this.img = this.imageCache[this.IMAGES_SPLASH[this.splashFrame]];
    this.splashFrame++;
  }

  /**
   * Prueft, ob das Zerplatzen fertig gezeigt wurde.
   * @returns {boolean} true, wenn die Flasche entfernt werden kann.
   */
  isSplashFinished() {
    return this.splashFrame >= this.IMAGES_SPLASH.length;
  }

  /** Stoppt alle Schleifen, damit nach dem Entfernen nichts weiterlaeuft. */
  stopIntervals() {
    clearInterval(this.gravityInterval);
    clearInterval(this.flightInterval);
    clearInterval(this.animationInterval);
  }
}
