export class Player {
  constructor() {
    this.sprite = new Sprite();
    this.sprite.diameter = 50;
    this.sprite.y = -70;
    this.sprite.fill = 'red';
  }

  isTouchingFloor(floor) {
    let playerBottom = this.sprite.y + this.sprite.h / 2;
    let floorTop = floor.y - floor.h / 2;
    let closeToFloor = playerBottom >= floorTop - 10 && this.sprite.vel.y >= 0;

    return this.sprite.colliding(floor) > 0 || closeToFloor;
  }

  move(floor) {
    this.sprite.vel.x = 0;

    let horVel = 5;
    let vertVel = 5;
    if (kb.pressing('arrowLeft')) this.sprite.vel.x = -1*horVel;
    
    if (kb.pressing('arrowRight')) this.sprite.vel.x = horVel;

    if (kb.presses('arrowUp') && this.isTouchingFloor(floor)) this.sprite.vel.y = -1 * vertVel;
  }
}
