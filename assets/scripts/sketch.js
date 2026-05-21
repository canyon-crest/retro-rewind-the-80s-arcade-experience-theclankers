//#region Imports
import { Player } from './player.js';
import { GameCamera } from './camera.js';
import { drawBackground, loadBackground } from './background.js';
import { drawScenes } from './scenes.js';
import { debug } from './debug.js';
import { updateUnlockItems } from './abilityObj.js';
//#endregion


await Canvas();

//object setups
world.gravity.y = 10;

let gameBackground = loadBackground('back.png', 'middle.png', 'front.png');

export let player = new Player();

let gameCamera = new GameCamera(player);
let enemies = drawScenes(player);

q5.update = function () {
  player.move(enemies);
  enemies.forEach(enemy => enemy.move());
  gameCamera.followXY();

  clear();
  updateUnlockItems(player);
  background('white');
  drawBackground(gameBackground);
  debug(enemies);
};
