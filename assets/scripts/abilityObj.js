import { ABILITIES } from './saveData.js';

class UnlockItem {
  static all = [];

  constructor(x, y, ability, color) {
    this.ability = ability;
    this.collected = false;
    this.collectRadius = 42;

    this.sprite = new Sprite();
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.diameter = 30;
    this.sprite.fill = color;
    this.sprite.stroke = 'white';
    this.sprite.strokeWeight = 3;
    this.sprite.collider = 'none';
    this.sprite.physics = STATIC;

    UnlockItem.all.push(this);
  }

  overlapsPlayer(player) {
    let xDistance = this.sprite.x - player.sprite.x;
    let yDistance = this.sprite.y - player.sprite.y;
    return Math.hypot(xDistance, yDistance) <= this.collectRadius;
  }

  collect(player) {
    if (this.collected) return false;
    if (player.hasAbility(this.ability)) {
      this.remove();
      return false;
    }

    this.collected = player.unlockAbility(this.ability);
    if (this.collected) this.remove();
    return this.collected;
  }

  update(player) {
    if (this.collected) return false;
    if (!this.overlapsPlayer(player)) return false;

    return this.collect(player);
  }

  remove() {
    this.collected = true;
    if (this.sprite) {
      this.sprite.delete();
      this.sprite = null;
    }
  }

  static updateAll(player) {
    for (let unlockItem of UnlockItem.all) {
      unlockItem.update(player);
    }

    UnlockItem.all = UnlockItem.all.filter(unlockItem => !unlockItem.collected);
  }
}

export function updateUnlockItems(player) {
  UnlockItem.updateAll(player);
}

export class DoubleJumpUnlockItem extends UnlockItem {
  constructor(x, y) {
    super(x, y, ABILITIES.DOUBLE_JUMP, 'deepskyblue');
  }
}

export class WallClingUnlockItem extends UnlockItem {
  constructor(x, y) {
    super(x, y, ABILITIES.WALL_CLING, 'limegreen');
  }
}

export class DashUnlockItem extends UnlockItem {
  constructor(x, y) {
    super(x, y, ABILITIES.DASH, 'magenta');
  }
}
