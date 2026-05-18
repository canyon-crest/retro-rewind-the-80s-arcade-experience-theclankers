import { DDEBUG } from './globalVar.js'
import { Floor, Wall } from './envObjects.js'

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

export function debug(debugObjects = []) {
  Floor.all.forEach(floor => {
    floor.sprite.visible = DDEBUG.full;
  });

  Wall.all.forEach(wall => {
    wall.sprite.visible = DDEBUG.full;
  });

  if (DDEBUG.full) {
    let wasCameraActive = camera.isActive;

    camera.on();
    debugObjects.forEach(drawEnemyVectors);

    if (!wasCameraActive) camera.off();
  }

  return DDEBUG.full;
}
