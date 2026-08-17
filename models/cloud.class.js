/** A cloud that slowly moves left across the sky. */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /** Places the cloud at a random position in the sky. */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 5000;
    this.animate();
  }

  /** Makes the cloud continuously move to the left. */
  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
  }
}
