import { debug } from'./debug.js';

export class Floor {
  constructor(y, w, h) {
    this.sprite = new Sprite();
    this.sprite.y = y;
    this.sprite.w = w;
    this.sprite.h = h;
    this.sprite.physics = STATIC;
    this.sprite.visible = debug();
  }
  
}