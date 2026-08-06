class Bottle extends DrawableObject {
  IMAGES = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  width = 100;
  height = 100;
  y = 350;

  constructor() {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = 200 + Math.random() * 2000;
  }
}
