/** Ein normales Huhn, das langsam von rechts nach links durch das Level laeuft. */
class Chicken extends MovableObject {
  y = 350;
  height = 60;
  width = 100;
  energy = 5;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGES_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Setzt das Huhn mit zufaelligem Versatz und zufaelligem Tempo ins Level.
   * @param {number} x - Ungefaehre Startposition im Level.
   */
  constructor(x) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x + Math.random() * 100;
    this.speed = 0.15 + Math.random() + 0.5;
    this.animate();
  }

  /** Startet die Schleifen fuer Bewegung und Animation. */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  /** Laeuft nach links, solange das Huhn lebt. */
  updateMovement() {
    if (!this.isDead()) {
      this.moveLeft();
    }
  }

  /** Spielt die Lauf- oder die Todes-Animation. */
  updateAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
