/** The player character Pepe, controlled by the user via keyboard and touch. */
class Character extends MovableObject {
  height = 250;
  y = 80;
  offsetLeft = 25;
  offsetRight = 25;
  offsetTop = 80;
  offsetBottom = 10;
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

  /** Loads all character images and starts gravity and animation. */
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

  /** Starts the movement and animation loops. */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 50);
  }

  /**
   * Processes keyboard input and aligns the camera with the character.
   * If the character is dead, no keyboard input is processed.
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

  /** Moves the character while a directional key is pressed. */
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

  /** Makes the character jump when standing on the ground. */
  checkJump() {
    let jumpPressed = this.world.keyboard.SPACE || this.world.keyboard.UP;
    if (jumpPressed && !this.isAboveGround()) {
      this.jump();
      playSound('jump');
      this.lastMovement = new Date().getTime();
    }
  }

  /** Updates the character's animation and looping sounds. */
  updateAnimation() {
    if (gamePaused) {
      return;
    }
    this.playCharacterAnimation();
    this.updateLoopSounds();
  }

  /** Plays the animation that matches the current state. */
  playCharacterAnimation() {
    if (this.isDead()) {
      this.playDeadAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else if (this.isWalking()) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isSleeping()) {
      this.playAnimation(this.IMAGES_SLEEPING);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /** Shows the jump image that belongs to the current point of the jump. */
  playJumpAnimation() {
    this.img = this.imageCache[this.IMAGES_JUMPING[this.resolveJumpFrame()]];
  }

  /**
   * Picks the image by the current rising or falling speed instead of looping.
   * The speed runs from full upward to full downward momentum exactly once per
   * jump, so the nine images are shown once and stay in sync with the arc.
   * @returns {number} Index in IMAGES_JUMPING.
   */
  resolveJumpFrame() {
    let progress = (JUMP_SPEED - this.speedY) / (2 * JUMP_SPEED);
    let frame = Math.floor(progress * this.IMAGES_JUMPING.length);
    return Math.min(Math.max(frame, 0), this.IMAGES_JUMPING.length - 1);
  }

  /** Plays the death animation once through the final frame. */
  playDeadAnimation() {
    if (this.deadFrame < this.IMAGES_DEAD.length - 1) {
      this.deadFrame++;
    }
    this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
  }

  /** Starts and stops the walking and snoring sounds. */
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
   * Checks whether a directional key is currently pressed.
   * @returns {boolean} true if the character should walk.
   */
  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Checks whether the character has been inactive for 15 seconds.
   * @returns {boolean} true if the sleeping animation should play.
   */
  isSleeping() {
    let timePassed = (new Date().getTime() - this.lastMovement) / 1000;
    return timePassed > 15;
  }
}
