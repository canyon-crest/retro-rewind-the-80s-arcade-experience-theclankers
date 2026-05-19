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
      let closeToFloor = playerBottom >= floorTop - 1 && playerBottom <= floorTop + 20 && player.vel.y >= 0;

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
    return Wall.jumpDirection(player) !== 0;
  }

  static jumpDirection(player) {
    for (let wall of Wall.all) {
      let playerHalfWidth = player.w / 2;
      let playerHalfHeight = player.h / 2;
      let wallHalfWidth = wall.sprite.w / 2;
      let wallHalfHeight = wall.sprite.h / 2;
      let verticalOverlap = Math.abs(player.y - wall.sprite.y) <= playerHalfHeight + wallHalfHeight;
      let wallDistance = Math.abs(player.x - wall.sprite.x);
      let closeToWall = wallDistance <= playerHalfWidth + wallHalfWidth + 6;

      if (verticalOverlap && (player.colliding(wall.sprite) > 0 || closeToWall)) {
        return player.x < wall.sprite.x ? -1 : 1;
      }
    }

    return 0;
  }
}
