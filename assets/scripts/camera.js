export class GameCamera {
  constructor(target) {
    this.target = target;
    this.smoothness = 0.1;
  }

  followX() {
    camera.x = lerp(camera.x, this.target.sprite.x, this.smoothness);
    camera.y = 0;
  }

  followXY() {
    camera.x = lerp(camera.x, this.target.sprite.x, this.smoothness);
    camera.y = lerp(camera.y, this.target.sprite.y, this.smoothness);
  }
}
