export function addCharacterAnimations(sprite, character) {
  let base = new URL(`../spriteSheets/${character}/`, import.meta.url).href;
  let visualScale = 1.8;
  let visualOffset = { x: 0, y: -1 };
  let frameSize = character === 'Ninja_Peasant' ? 96 : 128;
  let runFrames = character === 'Ninja_Peasant' ? 6 : 8;

  sprite.addAni('idle', base + 'Idle.png', { width: frameSize, height: frameSize, frames: 6 });
  sprite.addAni('run', base + 'Run.png', { width: frameSize, height: frameSize, frames: runFrames });
  //sprite.addAni('jump', base + 'Jump.png', { width: 128, height: 128, frames: 9 });

  for (let animation of [sprite.anis.idle, sprite.anis.run]) {
    animation.frameDelay = character === 'Ninja_Peasant' ? 10 : 6;
    animation.scale = visualScale;
    animation.offset = visualOffset;
  }
}
