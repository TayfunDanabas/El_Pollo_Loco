/** Basisklasse fuer alle Objekte, die sich bewegen und Schaden nehmen koennen. */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  /** Laesst das Objekt fallen, solange es sich ueber dem Boden befindet. */
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

  /**
   * Prueft, ob sich das Objekt in der Luft befindet.
   * Geworfene Flaschen fallen immer und gelten daher immer als in der Luft.
   * @returns {boolean} true, wenn das Objekt nicht auf dem Boden steht.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Prueft, ob sich dieses Objekt mit einem anderen ueberschneidet.
   * @param {DrawableObject} mo - Das andere Objekt.
   * @returns {boolean} true bei einer Kollision.
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y + mo.offsetY &&
      this.x < mo.x + mo.width &&
      this.y + this.offsetY < mo.y + mo.height
    );
  }

  /**
   * Prueft, ob dieses Objekt von oben auf ein anderes springt.
   * @param {DrawableObject} mo - Das andere Objekt.
   * @returns {boolean} true, wenn es im Fallen von oben getroffen wird.
   */
  isJumpingOn(mo) {
    return (
      this.isColliding(mo) &&
      this.isAboveGround() &&
      this.speedY < 0 &&
      this.y + this.height < mo.y + mo.height
    );
  }

  /**
   * Zieht dem Objekt Energie ab und merkt sich den Zeitpunkt des Treffers.
   * @param {number} [damage] - Abgezogene Energie. Ohne Angabe sind es 5.
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
   * Prueft, ob der letzte Treffer weniger als eine Sekunde her ist.
   * @returns {boolean} true, solange die Verletzt-Animation laufen soll.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Prueft, ob die Energie aufgebraucht ist.
   * @returns {boolean} true, wenn das Objekt keine Energie mehr hat.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Zeigt das naechste Bild einer Bilderreihe und laesst sie so animiert wirken.
   * @param {string[]} images - Pfade der Bilder dieser Animation.
   */
  playAnimation(images) {
    if (gamePaused) {
      return;
    }
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /** Bewegt das Objekt um seine Geschwindigkeit nach rechts. */
  moveRight() {
    if (gamePaused) {
      return;
    }
    this.x += this.speed;
  }

  /** Bewegt das Objekt um seine Geschwindigkeit nach links. */
  moveLeft() {
    if (gamePaused) {
      return;
    }
    this.x -= this.speed;
  }

  /** Gibt dem Objekt Schwung nach oben fuer einen Sprung. */
  jump() {
    this.speedY = 30;
  }

  /** Laesst das Objekt zurueckfedern, nachdem es auf einen Gegner gesprungen ist. */
  bounce() {
    this.speedY = 20;
  }
}
