export class Floor {
  static all = [];

  constructor(y, w, h) {
    this.sprite = new Sprite();
    this.sprite.y = y;
    this.sprite.w = w;
    this.sprite.h = h;
    this.sprite.physics = STATIC;

    Floor.all.push(this);
  }
  
  static touching(player) {
    return Floor.all.some(floor => {
      let playerBottom = player.y + player.h / 2;
      let floorTop = floor.sprite.y - floor.sprite.h / 2;
      let closeToFloor = playerBottom >= floorTop - 10 && player.vel.y >= 0;

      return player.colliding(floor.sprite) > 0 || closeToFloor;
    })
  }

}

export class Wall {
  static all = [];

  constructor(x, y, w, h) {
    this.sprite = new Sprite();
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.w = w;
    this.sprite.h = h;
    this.sprite.physics = STATIC;

    Wall.all.push(this);
  }
  
  static touching(player) {
    return Wall.all.some(wall => {
      return -1;
    })
  }
}