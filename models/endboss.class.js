/** Das grosse Huhn am Ende des Levels, das mehr Treffer aushaelt als die Gegner. */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  speed = 5;
  energy = 25;
  world;
  isAlerted = false;
  deadFrame = 0;

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /** Laedt alle Bilder des Endbosses und stellt ihn ans Ende des Levels. */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 4700;
    this.animate();
  }

  /** Startet die Schleifen fuer Bewegung und Animation. */
  animate() {
    setInterval(() => this.updateMovement(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 200);
  }

  /** Weckt den Endboss und laesst ihn dem Charakter folgen. */
  updateMovement() {
    this.checkAlert();
    if (this.isAlerted && !this.isDead()) {
      this.followCharacter();
    }
  }

  /** Weckt den Endboss, sobald der Charakter nah genug herankommt. */
  checkAlert() {
    if (this.isAlerted || !this.world) {
      return;
    }
    if (this.world.character.x > this.x - 600) {
      this.isAlerted = true;
    }
  }

  /** Laeuft in die Richtung, in der sich der Charakter befindet. */
  followCharacter() {
    if (this.world.character.x < this.x) {
      this.moveLeft();
      this.otherDirection = false;
    } else {
      this.moveRight();
      this.otherDirection = true;
    }
  }

  /** Spielt die Animation, die zum aktuellen Zustand passt. */
  updateAnimation() {
    if (this.isDead()) {
      this.playDeadAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.world && this.world.character.isColliding(this)) {
      this.playAnimation(this.IMAGES_ATTACK);
    } else if (this.isAlerted) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /** Spielt die Sterbeanimation einmalig bis zum letzten Bild ab. */
  playDeadAnimation() {
    if (this.deadFrame < this.IMAGES_DEAD.length - 1) {
      this.deadFrame++;
    }
    this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
  }
}
