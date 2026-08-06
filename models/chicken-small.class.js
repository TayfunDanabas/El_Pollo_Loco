class ChickenSmall extends MovableObject {
  y = 365;
  height = 45;
  width = 60;
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);

    this.x = 500 + Math.random() * 1700;
    this.speed = 0.5 + Math.random() + 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
