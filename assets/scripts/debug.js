import { DDEBUG } from './globalVar.js'
import { Floor, Wall } from './envObjects.js'

const DEBUG_HITBOX_COLORS = {
  enemy: '#ff4d4d',
  player: '#3b82f6',
  playerAttack: '#22c55e'
};

function drawDebugVector(origin, debugVector, scale) {
  let endX = origin.x + debugVector.vector.x * scale;
  let endY = origin.y + debugVector.vector.y * scale;
  let angle = Math.atan2(endY - origin.y, endX - origin.x);
  let arrowSize = 8;

  push();
  stroke(debugVector.color);
  strokeWeight(3);
  line(origin.x, origin.y, endX, endY);

  fill(debugVector.color);
  noStroke();
  triangle(
    endX,
    endY,
    endX - Math.cos(angle - 0.45) * arrowSize,
    endY - Math.sin(angle - 0.45) * arrowSize,
    endX - Math.cos(angle + 0.45) * arrowSize,
    endY - Math.sin(angle + 0.45) * arrowSize
  );
  pop();
}

function drawEnemyVectors(enemy) {
  if (!enemy.getDebugVectors) return;

  let origin = {
    x: enemy.sprite.x,
    y: enemy.sprite.y
  };
  let scale = 80;

  enemy.getDebugVectors().forEach(debugVector => {
    drawDebugVector(origin, debugVector, scale);
  });
}

function drawSpriteHitbox(sprite, color) {
  if (!sprite) return;

  push();
  noFill();
  stroke(color);
  strokeWeight(2);
  rectMode(CENTER);
  rect(sprite.x, sprite.y, sprite.w, sprite.h);
  pop();
}

function drawPlayerAttackHitbox(player, color) {
  if (!player?.getAttackHitbox || !player.isAttacking?.()) return;

  let hitbox = player.getAttackHitbox();

  push();
  noFill();
  stroke(color);
  strokeWeight(2);
  rectMode(CENTER);
  rect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
  pop();
}

export function debug({ player = null, enemies = [] } = {}) {
  Floor.all.forEach(floor => {
    floor.sprite.visible = DDEBUG.full;
  });

  Wall.all.forEach(wall => {
    wall.sprite.visible = DDEBUG.full;
  });

  if (DDEBUG.full) {
    let wasCameraActive = camera.isActive;

    camera.on();
    enemies.forEach(drawEnemyVectors);
    enemies.forEach(enemy => drawSpriteHitbox(enemy.sprite, DEBUG_HITBOX_COLORS.enemy));
    drawSpriteHitbox(player?.sprite, DEBUG_HITBOX_COLORS.player);
    drawPlayerAttackHitbox(player, DEBUG_HITBOX_COLORS.playerAttack);

    if (!wasCameraActive) camera.off();
  }

  return DDEBUG.full;
}
