function wrap(value, size) {
  return ((value % size) + size) % size;
}

const BACKGROUND_SCALE = 4;

function drawParallaxLayer(img, speed) {
  let tileW = img.width * BACKGROUND_SCALE;
  let tileH = img.height * BACKGROUND_SCALE;

  if (!tileW) return;

  let left = -width / 2;
  let right = width / 2;
  let top = height / 2 - tileH;
  let offset = wrap(camera.x * speed, tileW);

  let startX = left - offset - tileW;

  for (let x = startX; x < right + tileW; x += tileW) {
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
