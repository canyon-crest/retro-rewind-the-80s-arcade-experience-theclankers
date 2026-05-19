import { Floor, Wall } from './envObjects.js'
import { DoubleJumpUnlockItem, WallClingUnlockItem, DashUnlockItem } from './abilityObj.js';
import { Enemy } from './enemy.js';

function testScene(player) {
  let floor = new Floor(20, 100000, 5);
  let wall = new Wall(0, 0, 5, 10000000);
  let dj = new DoubleJumpUnlockItem(500,5);
  let wc = new WallClingUnlockItem(250,5)
  let dash = new DashUnlockItem(150,5);
  let enemy = new Enemy(player, 350, -70);

  return [enemy];
}


export function drawScenes(player) {
  return testScene(player);
}
