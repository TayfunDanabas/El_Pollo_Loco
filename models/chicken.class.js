/** A regular chicken that slowly moves through the level from right to left. */
class Chicken extends MovableObject {
  y = 355;
  height = 60;
  width = 100;
  energy = 5;
  offsetLeft = 12;
  offsetRight = 12;
  offsetTop = 4;
  offsetBottom = 4;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGES_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Places the chicken in the level with a random offset and random speed.
   * @param {number} x - Approximate starting position in the level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x + Math.random() * 100;
    this.speed = 0.15 + Math.random() + 0.5;
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
