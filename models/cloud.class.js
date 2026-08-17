/** Eine Wolke, die langsam am Himmel nach links zieht. */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /** Setzt die Wolke an eine zufaellige Stelle am Himmel. */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 5000;
    this.animate();
  }

  /** Laesst die Wolke dauerhaft nach links ziehen. */
  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
  }
}
