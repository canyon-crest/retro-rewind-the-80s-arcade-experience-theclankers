function wrap(value, size) {
  return ((value % size) + size) % size;
}

const BACKGROUND_SCALE = 1;

function drawParallaxLayer(img, speed) {
  let tileW = img.width * BACKGROUND_SCALE;
  let tileH = img.height * BACKGROUND_SCALE;

  if (!Number.isFinite(tileW) || !Number.isFinite(tileH) || tileW <= 0 || tileH <= 0) {
    return;
  }

  let left = -width / 2;
  // Keep the background aligned to the world's Y axis while drawing with the camera off.
  let top = height / 2 - tileH - camera.y;
  let offset = wrap(camera.x * speed, tileW);
  let startX = left - offset - tileW;
  let tilesNeeded = ceil(width / tileW) + 3;

  for (let i = 0; i < tilesNeeded; i++) {
    let x = startX + i * tileW;
    image(img, x, top, tileW, tileH);
  }
}

export function loadBackground(bgFar, bgMid, bgNear) {
  return {
    far: loadImage(new URL('../images/' + bgFar, import.meta.url).href),
    mid: loadImage(new URL('../images/' + bgMid, import.meta.url).href),
    near: loadImage(new URL('../images/' + bgNear, import.meta.url).href),
  };
}

export function drawBackground(background) {
  let wasCameraActive = camera.isActive;

  camera.off();
  drawParallaxLayer(background.far, 0.15);
  drawParallaxLayer(background.mid, 0.35);
  drawParallaxLayer(background.near, 0.65);

  if (wasCameraActive) camera.on();
}
