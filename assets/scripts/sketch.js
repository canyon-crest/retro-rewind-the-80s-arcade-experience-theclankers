//Imports
import { Player } from './player.js';
import { GameCamera } from './camera.js';
import { drawBackground, loadBackground } from './background.js';

await Canvas();

//object setups
world.gravity.y = 10;

let gameBackground = loadBackground('back copy.png', 'middle copy.png', 'front copy.png');

let player = new Player();

let gameCamera = new GameCamera(player);

let floor = new Sprite();
floor.y = 90;
floor.w = 1000000;
floor.h = 5;
floor.physics = STATIC;
floor.autoDraw = false;

q5.update = function () {
  player.move(floor);
  gameCamera.followXY(player);

  clear();
  drawBackground(gameBackground);
};
