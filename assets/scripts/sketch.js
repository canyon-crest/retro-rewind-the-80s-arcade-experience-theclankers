//Imports
import { Player } from './player.js';
import { GameCamera } from './camera.js';
import { drawBackground, loadBackground } from './background.js';

await Canvas();

//object setups
world.gravity.y = 10;

let DDEBUG = false;

let gameBackground = loadBackground('back.png', 'middle.png', 'front.png');

let player = new Player();

let gameCamera = new GameCamera(player);

let floor = new Sprite();
floor.y = 20;
floor.w = 10000;
floor.h = 5;
floor.physics = STATIC;
floor.visible = false;

let debugToggle = document.querySelector('#debug-toggle');

function updateDebugToggle() {
  if (!debugToggle) return;
  debugToggle.textContent = `Debug: ${DDEBUG ? 'On' : 'Off'}`;
  debugToggle.setAttribute('aria-pressed', DDEBUG);
}

function debug(bool) {
  floor.visible = bool;
}

if (debugToggle) {
  debugToggle.addEventListener('click', () => {
    DDEBUG = !DDEBUG;
    debug(DDEBUG);
    updateDebugToggle();
  });
}

updateDebugToggle();

q5.update = function () {
  player.move(floor);
  gameCamera.followXY();

  clear();
  debug(DDEBUG);
  drawBackground(gameBackground);
};
