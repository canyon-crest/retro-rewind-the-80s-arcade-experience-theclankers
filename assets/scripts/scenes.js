import { Floor } from './envObjects.js';
import { Enemy } from './enemy.js';

export const ARENA_FLOOR_Y = 207.5;
export const ARENA_FLOOR_WIDTH = 100000;
export const ARENA_FLOOR_HEIGHT = 5;
export const ARENA_PLAYER_SPAWN = { x: 200, y: 145 };
export const ARENA_BOSS_SPAWN = { x: 520, y: ARENA_FLOOR_Y - 45 };

function combatArena(player) {
  let floor = new Floor(ARENA_FLOOR_Y, ARENA_FLOOR_WIDTH, ARENA_FLOOR_HEIGHT);
  let enemy = new Enemy(player, 350, 160);

  return [enemy];
}

export function drawScenes(player) {
  return combatArena(player);
}
