import { Floor } from './envObjects.js'
import { Enemy } from './enemy.js';

function combatArena(player) {
  let floor = new Floor(207.5, 100000, 5);
  let enemy = new Enemy(player, 350, 160);

  return [enemy];
}


export function drawScenes(player) {
  return combatArena(player);
}
