const CHARACTER_ANIMATION_DATA = {
  Samurai: { frameSize: 128, idle: 6, run: 8, attack1: 4, attack2: 5, attack3: 4 },
  Ninja_Peasant: { frameSize: 96, idle: 6, run: 6, attack1: 6 },
  Kunoichi: { frameSize: 128, idle: 9, run: 8, attack1: 6 },
  Ninja_Monk: { frameSize: 96, idle: 7, run: 8, attack1: 5 },
  Kitsune: { frameSize: 128, idle: 8, run: 8, attack1: 10 },
  Yamabushi_tengu: { frameSize: 128, idle: 6, run: 8, attack1: 3 },
  Karasu_tengu: { frameSize: 128, idle: 6, run: 8, attack1: 6 }
};

export function addCharacterAnimations(sprite, character, options = {}) {
  let base = new URL(`../spriteSheets/${character}/`, import.meta.url).href;
  let animationData = CHARACTER_ANIMATION_DATA[character] || CHARACTER_ANIMATION_DATA.Samurai;
  let visualScale = options.scale ?? 1.8;
  let visualOffset = options.offset ?? { x: 0, y: -1 };
  let frameSize = animationData.frameSize;

  sprite.addAni('idle', base + 'Idle.png', { width: frameSize, height: frameSize, frames: animationData.idle });
  sprite.addAni('run', base + 'Run.png', { width: frameSize, height: frameSize, frames: animationData.run });
  if (animationData.attack1) sprite.addAni('attack1', base + 'Attack_1.png', { width: frameSize, height: frameSize, frames: animationData.attack1 });
  if (animationData.attack2) sprite.addAni('attack2', base + 'Attack_2.png', { width: frameSize, height: frameSize, frames: animationData.attack2 });
  if (animationData.attack3) sprite.addAni('attack3', base + 'Attack_3.png', { width: frameSize, height: frameSize, frames: animationData.attack3 });
  //sprite.addAni('jump', base + 'Jump.png', { width: 128, height: 128, frames: 9 });

  for (let animation of [sprite.anis.idle, sprite.anis.run, sprite.anis.attack1, sprite.anis.attack2, sprite.anis.attack3].filter(Boolean)) {
    animation.frameDelay = character === 'Ninja_Peasant' ? 10 : 6;
    animation.scale = visualScale;
    animation.offset = visualOffset;
  }
}

let demonSlimeCache = null;

export async function preloadDemonSlimeAnimations() {
  if (demonSlimeCache) return demonSlimeCache;

  let temp = new Sprite();
  let sheet = new URL('../spriteSheets/demon_slime_FREE_v1.0_288x160_spritesheet.png', import.meta.url).href;
  let frameSize = [288, 160];

  let idlePromise = temp.addAni('idle', sheet, { frameSize, frames: 6, row: 0 });
  let runPromise = temp.addAni('run', sheet, { frameSize, frames: 12, row: 1 });
  let attackPromise = temp.addAni('attack1', sheet, { frameSize, frames: 15, row: 2 });

  await Promise.all([idlePromise, runPromise, attackPromise]);

  demonSlimeCache = {
    idle: temp.anis.idle,
    run: temp.anis.run,
    attack1: temp.anis.attack1
  };

  temp.delete();

  return demonSlimeCache;
}

export function addDemonSlimeAnimations(sprite, options = {}) {
  let sheet = new URL('../spriteSheets/demon_slime_FREE_v1.0_288x160_spritesheet.png', import.meta.url).href;
  let visualScale = options.scale ?? 1.4;
  let visualOffset = options.offset ?? { x: 0, y: -6 };
  let frameSize = [288, 160];

  if (demonSlimeCache) {
    sprite.addAni('idle', demonSlimeCache.idle);
    sprite.addAni('run', demonSlimeCache.run);
    sprite.addAni('attack1', demonSlimeCache.attack1);
  } else {
    sprite.addAni('idle', sheet, { frameSize, frames: 6, row: 0 });
    sprite.addAni('run', sheet, { frameSize, frames: 12, row: 1 });
    sprite.addAni('attack1', sheet, { frameSize, frames: 15, row: 2 });
  }

  for (let animation of [sprite.anis.idle, sprite.anis.run, sprite.anis.attack1].filter(Boolean)) {
    animation.frameDelay = 6;
    animation.scale = visualScale;
    animation.offset = visualOffset;
  }
}
