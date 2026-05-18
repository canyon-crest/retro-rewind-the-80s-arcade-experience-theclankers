import { Floor, Wall } from './envObjects.js';

export class Player {
  constructor() {
    this.sprite = new Sprite();
    this.sprite.diameter = 50;
    this.sprite.y = -70;
    this.sprite.fill = 'red';
  }

  isTouchingFloor() {
    return Floor.touching(this.sprite);
  }

  move() {
    this.sprite.vel.x = 0;

    let horVel = 5;
    let vertVel = 5;
    if (kb.pressing('arrowLeft')) this.sprite.vel.x = -1*horVel;
    
    if (kb.pressing('arrowRight')) this.sprite.vel.x = horVel;

    if (kb.presses('arrowUp') && this.isTouchingFloor()) this.sprite.vel.y = -1 * vertVel;
  }
}
