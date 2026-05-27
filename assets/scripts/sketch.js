//#region Imports
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { GameCamera } from './camera.js';
import { drawBackground, loadBackground } from './background.js';
import { drawScenes } from './scenes.js';
import { debug } from './debug.js';
//#endregion


await Canvas(960, 540);

//object setups
world.gravity.y = 10;

let gameBackground = loadBackground('back.png', 'middle.png', 'front.png');

export let player = new Player();

let gameCamera = new GameCamera(player);
let enemies = drawScenes(player);
let killCount = 0;
let gameOver = false;
let gameOverHandled = false;
let spawnTimer = 180;
let activeEnemyCap = 5;
let baseSpawnInterval = 240;
let minimumSpawnInterval = 90;
let hpDisplay = document.querySelector('#hp-display');
let killDisplay = document.querySelector('#kill-display');
let gameOverOverlay = document.querySelector('#game-over-overlay');
let finalKillsDisplay = document.querySelector('#final-kills');

function activeEnemies() {
  return enemies.filter(enemy => !enemy.isDead);
}

function currentSpawnInterval() {
  let killRamp = killCount * 12;
  let timeRamp = Math.floor(frameCount / 600) * 20;
  return Math.max(minimumSpawnInterval, baseSpawnInterval - killRamp - timeRamp);
}

function spawnEnemy() {
  if (activeEnemies().length >= activeEnemyCap) return;

  let spawnSide = random() < 0.5 ? -1 : 1;
  let spawnX = camera.x + spawnSide * (width / 2 + 100);
  let spawnY = 160;

  enemies.push(new Enemy(player, spawnX, spawnY));
}

function updateSpawns() {
  if (activeEnemies().length >= activeEnemyCap) return;

  spawnTimer--;
  if (spawnTimer > 0) return;

  spawnEnemy();
  spawnTimer = currentSpawnInterval();
}

function recordEnemyKill() {
  killCount++;
}

function updateHud() {
  if (hpDisplay) hpDisplay.textContent = `HP: ${player.health}/${player.maxHealth}`;
  if (killDisplay) killDisplay.textContent = `Kills: ${killCount}`;
}

function showGameOver() {
  if (finalKillsDisplay) finalKillsDisplay.textContent = `Kills: ${killCount}`;
  if (gameOverOverlay) gameOverOverlay.hidden = false;
}

function stopSprites() {
  player.sprite.vel.x = 0;
  player.sprite.vel.y = 0;

  activeEnemies().forEach(enemy => {
    enemy.sprite.vel.x = 0;
    enemy.sprite.vel.y = 0;
  });
}

function endGame() {
  stopSprites();

  if (gameOverHandled) return;

  gameOverHandled = true;
  showGameOver();
}

q5.update = function () {
  if (!gameOver) {
    player.move(enemies, recordEnemyKill);
    enemies.forEach(enemy => enemy.move());
    enemies = activeEnemies();
    updateSpawns();
    gameOver = !player.isAlive();
    if (gameOver) endGame();
  } else {
    endGame();
  }

  gameCamera.followXY();

  clear();
  background('white');
  drawBackground(gameBackground);
  debug({ player, enemies });
  updateHud();
};
