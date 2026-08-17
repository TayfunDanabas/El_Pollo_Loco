/** Der Spielcharakter Pepe, den der Benutzer ueber Tasten und Touch steuert. */
class Character extends MovableObject {
  height = 250;
  y = 80;
  offsetY = 80;
  world;
  speed = 10;
  lastMovement = new Date().getTime();
  deadFrame = 0;

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_SLEEPING = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  /** Laedt alle Bilder des Charakters und startet Schwerkraft und Animation. */
  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.applyGravity();
    this.animate();
  }

  /** Startet die Schleifen fuer Bewegung und Animation. */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 50);
  }

  /**
   * Wertet die Tasten aus und richtet die Kamera am Charakter aus.
   * Ist der Charakter tot, reagiert er auf keine Taste mehr.
   */
  updateMovement() {
    if (gamePaused) {
      return;
    }
    if (!this.isDead()) {
      this.moveByKeyboard();
      this.checkJump();
    }
    this.world.cameraX = -this.x + 100;
  }

  /** Bewegt den Charakter, solange eine Richtungstaste gedrueckt ist. */
  moveByKeyboard() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.levelEndX) {
      this.moveRight();
      this.otherDirection = false;
      this.lastMovement = new Date().getTime();
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.lastMovement = new Date().getTime();
    }
  }

  /** Laesst den Charakter springen, wenn er auf dem Boden steht. */
  checkJump() {
    let jumpPressed = this.world.keyboard.SPACE || this.world.keyboard.UP;
    if (jumpPressed && !this.isAboveGround()) {
      this.jump();
      playSound('jump');
      this.lastMovement = new Date().getTime();
    }
  }

  /** Aktualisiert Animation und Dauergeraeusche des Charakters. */
  updateAnimation() {
    if (gamePaused) {
      return;
    }
    this.playCharacterAnimation();
    this.updateLoopSounds();
  }

  /** Spielt die Animation, die zum aktuellen Zustand passt. */
  playCharacterAnimation() {
    if (this.isDead()) {
      this.playDeadAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.isWalking()) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isSleeping()) {
      this.playAnimation(this.IMAGES_SLEEPING);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /** Spielt die Sterbeanimation einmalig bis zum letzten Bild ab. */
  playDeadAnimation() {
    if (this.deadFrame < this.IMAGES_DEAD.length - 1) {
      this.deadFrame++;
    }
    this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
  }

  /** Startet und stoppt die Sounds fuer Laufen und Schnarchen. */
  updateLoopSounds() {
    if (this.isWalking() && !this.isAboveGround() && !this.isDead()) {
      startLoopSound('walk');
    } else {
      stopSound('walk');
    }
    if (this.isSleeping() && !this.isDead()) {
      startLoopSound('snore');
    } else {
      stopSound('snore');
    }
  }

  /**
   * Prueft, ob gerade eine Richtungstaste gedrueckt wird.
   * @returns {boolean} true, wenn der Charakter laufen soll.
   */
  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Prueft, ob der Charakter seit 15 Sekunden nichts mehr getan hat.
   * @returns {boolean} true, wenn die Schlaf-Animation laufen soll.
   */
  isSleeping() {
    let timePassed = (new Date().getTime() - this.lastMovement) / 1000;
    return timePassed > 15;
  }
}
