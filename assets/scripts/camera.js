export class GameCamera {
  constructor(target) {
    this.target = target;
    this.smoothness = 0.1;
    this.fixedY = -2.5;
  }

  followXY() {
    camera.x = lerp(camera.x, this.target.sprite.x, this.smoothness);
    camera.y = this.fixedY;
  }
}
