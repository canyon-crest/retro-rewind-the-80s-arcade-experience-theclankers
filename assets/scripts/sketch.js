//Imports
import { Player } from './player.js';
import { GameCamera } from './camera.js';

await Canvas();

//object setups
world.gravity.y = 10;

let player = new Player();

let gameCamera = new GameCamera(player);

let floor = new Sprite();
floor.y = 90;
floor.w = 3000;
floor.h = 5;
floor.physics = STATIC;

q5.update = function () {
  background('skyblue');
  player.move(floor);
  gameCamera.followXY(player);
};
