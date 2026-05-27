//#region Imports
import { Player } from './player.js';
import { BossEnemy, Enemy, ENEMY_PRESETS } from './enemy.js';
import { GameCamera } from './camera.js';
import { drawBackground, loadBackground } from './background.js';
import { preloadDemonSlimeAnimations } from './animation.js';
import { ARENA_BOSS_SPAWN, drawScenes } from './scenes.js';
import { debug } from './debug.js';
//#endregion


await Canvas(960, 540);

console.info('Sketch loaded');

await preloadDemonSlimeAnimations();

//object setups
world.gravity.y = 10;

let gameBackground = loadBackground('back.png', 'middle.png', 'front.png');

export let player = new Player();

let gameCamera = new GameCamera(player);
let enemies = drawScenes(player);
let killCount = 0;
let gameOver = false;
let gameOverHandled = false;
let gameWon = false;
let gameWonHandled = false;
let bossEncounterStarted = false;
let boss = null;
let spawnTimer = 180;
let activeEnemyCap = 5;
let baseSpawnInterval = 240;
let minimumSpawnInterval = 90;
let hpDisplay = document.querySelector('#hp-display');
let killDisplay = document.querySelector('#kill-display');
let gameOverOverlay = document.querySelector('#game-over-overlay');
let gameOverTitle = document.querySelector('#game-over-title');
let finalKillsDisplay = document.querySelector('#final-kills');
let gameOverMessage = document.querySelector('.game-over-panel p:last-child');

function activeEnemies() {
  return enemies.filter(enemy => !enemy.isDead);
}

function currentSpawnInterval() {
  let killRamp = killCount * 12;
  let timeRamp = Math.floor(frameCount / 600) * 20;
  return Math.max(minimumSpawnInterval, baseSpawnInterval - killRamp - timeRamp);
}

function getEnemyPool() {
  if (killCount >= 20) {
    return [
      ENEMY_PRESETS.NINJA_PEASANT,
      ENEMY_PRESETS.KUNOICHI,
      ENEMY_PRESETS.NINJA_MONK,
      ENEMY_PRESETS.KITSUNE,
      ENEMY_PRESETS.YAMABUSHI_TENGU
    ];
  }

  if (killCount >= 10) {
    return [
      ENEMY_PRESETS.NINJA_PEASANT,
      ENEMY_PRESETS.KUNOICHI,
      ENEMY_PRESETS.NINJA_MONK
    ];
  }

  return [ENEMY_PRESETS.NINJA_PEASANT];
}

function randomEnemyPreset() {
  let enemyPool = getEnemyPool();
  return enemyPool[Math.floor(random(enemyPool.length))];
}

function spawnEnemy() {
  if (bossEncounterStarted) return;
  if (activeEnemies().length >= activeEnemyCap) return;

  let spawnSide = random() < 0.5 ? -1 : 1;
  let spawnX = camera.x + spawnSide * (width / 2 + 100);
  let spawnY = 160;

  enemies.push(new Enemy(player, spawnX, spawnY, randomEnemyPreset()));
}

function updateSpawns() {
  if (bossEncounterStarted) return;
  if (activeEnemies().length >= activeEnemyCap) return;

  spawnTimer--;
  if (spawnTimer > 0) return;

  spawnEnemy();
  spawnTimer = currentSpawnInterval();
}

function removeRegularEnemies() {
  enemies.forEach(enemy => {
    if (enemy.isBoss) return;

    enemy.isDead = true;
    if (enemy.sprite) enemy.sprite.delete();
  });

  enemies = enemies.filter(enemy => !enemy.isDead);
}

function startBossEncounter() {
  if (bossEncounterStarted) return;

  bossEncounterStarted = true;
  removeRegularEnemies();
  boss = new BossEnemy(player, ARENA_BOSS_SPAWN.x, ARENA_BOSS_SPAWN.y);
  enemies = [boss];
}

function recordEnemyKill(enemy) {
  if (enemy?.isBoss) {
    gameWon = true;
    return;
  }

  killCount++;

  if (killCount >= 30) startBossEncounter();
}

function updateHud() {
  if (hpDisplay) hpDisplay.textContent = `HP: ${player.health}/${player.maxHealth}`;
  if (killDisplay) killDisplay.textContent = `Kills: ${killCount}`;
}

function showEndOverlay(title, message) {
  if (gameOverTitle) gameOverTitle.textContent = title;
  if (finalKillsDisplay) finalKillsDisplay.textContent = `Kills: ${killCount}`;
  if (gameOverMessage) gameOverMessage.textContent = message;
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
  showEndOverlay('GAME OVER', 'Reload to try again');
}

function completeGame() {
  stopSprites();

  if (gameWonHandled) return;

  gameWonHandled = true;
  showEndOverlay('VICTORY', 'The demon slime is defeated');
}

q5.update = function () {
  if (!gameOver && !gameWon) {
    player.move(enemies, recordEnemyKill);
    enemies.forEach(enemy => enemy.move());
    enemies = activeEnemies();
    updateSpawns();
    gameOver = !player.isAlive();
    if (gameOver) endGame();
    if (gameWon) completeGame();
  } else if (gameWon) {
    completeGame();
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

