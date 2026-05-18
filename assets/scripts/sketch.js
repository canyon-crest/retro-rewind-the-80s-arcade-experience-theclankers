//#region Imports
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { GameCamera } from './camera.js';
import { drawBackground, loadBackground } from './background.js';
import { drawScenes } from './scenes.js';
import { debug } from './debug.js';
//#endregion


await Canvas();

//object setups
world.gravity.y = 10;

let gameBackground = loadBackground('back.png', 'middle.png', 'front.png');

let player = new Player();
let enemy = new Enemy(player);

let gameCamera = new GameCamera(player);
drawScenes();

q5.update = function () {
  player.move();
  enemy.move();
  gameCamera.followXY();

  clear();
  background('white');
  drawBackground(gameBackground);
  debug([enemy]);
};
