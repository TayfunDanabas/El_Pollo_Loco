/** A small chicken that moves faster than the regular chicken. */
class ChickenSmall extends MovableObject {
  y = 370;
  height = 45;
  width = 60;
  energy = 5;
  offsetLeft = 7;
  offsetRight = 7;
  offsetTop = 3;
  offsetBottom = 4;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  IMAGES_DEAD = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  /**
   * Places the chicken in the level with a random offset and random speed.
   * @param {number} x - Approximate starting position in the level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x + Math.random() * 100;
    this.speed = 0.5 + Math.random() + 0.5;
    this.animate();
  }

  /** Starts the movement and animation loops. */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  /** Moves left while the chicken is alive. */
  updateMovement() {
    if (!this.isDead()) {
      this.moveLeft();
    }
  }

  /** Plays the walking or death animation. */
  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
