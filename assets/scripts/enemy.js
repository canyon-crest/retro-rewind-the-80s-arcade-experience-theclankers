import { Floor } from './envObjects.js';
import { addCharacterAnimations, addDemonSlimeAnimations } from './animation.js';

export const ENEMY_PRESETS = {
  NINJA_PEASANT: {
    character: 'Ninja_Peasant',
    health: 3,
    maxSpeed: 1,
    attackDamage: 1,
    attackRange: 55,
    attackHeightRange: 80,
    w: 30,
    h: 90,
    animationScale: 2
  },
  KUNOICHI: {
    character: 'Kunoichi',
    health: 2,
    maxSpeed: 1.35,
    attackDamage: 1,
    attackRange: 58,
    attackHeightRange: 80,
    w: 28,
    h: 82,
    animationScale: 1.8,
    animationOffset: { x: 0, y: -12 }
  },
  NINJA_MONK: {
    character: 'Ninja_Monk',
    health: 5,
    maxSpeed: 0.9,
    attackDamage: 1,
    attackRange: 60,
    attackHeightRange: 88,
    w: 34,
    h: 92,
    animationScale: 2
  },
  KITSUNE: {
    character: 'Kitsune',
    health: 4,
    maxSpeed: 1.45,
    attackDamage: 2,
    attackRange: 65,
    attackHeightRange: 90,
    w: 34,
    h: 86,
    animationScale: 1.8
  },
  YAMABUSHI_TENGU: {
    character: 'Yamabushi_tengu',
    health: 6,
    maxSpeed: 1.05,
    attackDamage: 2,
    attackRange: 68,
    attackHeightRange: 95,
    w: 36,
    h: 96,
    animationScale: 1.85
  }
};

export class Enemy {
  constructor(player, x = 350, y = 160, config = ENEMY_PRESETS.NINJA_PEASANT) {
    this.config = { ...ENEMY_PRESETS.NINJA_PEASANT, ...config };
    this.player = player;
    this.sprite = new Sprite();
    this.sprite.w = this.config.w;
    this.sprite.h = this.config.h;
    this.sprite.y = y;
    this.sprite.x = x;
    this.sprite.rotationLock = true;

    if (this.config.isBoss) {
      addDemonSlimeAnimations(this.sprite, { scale: this.config.animationScale });
    } else {
      addCharacterAnimations(this.sprite, this.config.character, {
        scale: this.config.animationScale,
        offset: this.config.animationOffset
      });
    }
    this.currentAnimation = '';

    this.health = this.config.health;
    this.isBoss = false;
    this.isDead = false;
    this.hitFlashTimer = 0;
    this.hitFlashDuration = 6;
    this.normalOpacity = 1;
    this.hitFlashOpacity = 0.45;
    this.maxSpeed = this.config.maxSpeed;
    this.sightRange = 900;
    this.facingDirection = 1;
    this.jumpStrength = 5;
    this.attackRange = this.config.attackRange;
    this.attackHeightRange = this.config.attackHeightRange;
    this.attackDamage = this.config.attackDamage;
    this.attackDuration = 42;
    this.attackHitFrame = 18;
    this.attackCooldown = 70;
    this.attackTimer = 0;
    this.attackCooldownTimer = 0;
    this.attackHasHit = false;
    this.vectorWeights = {
      playerSeek: 1,
      heightSeek: 0.25,
      floorStick: 0.15
    };
  }

  isTouchingFloor() {
    return Floor.touching(this.sprite);
  }

  takeDamage(amount) {
    if (this.isDead) return false;

    this.health -= amount;
    if (this.health > 0) {
      this.hitFlashTimer = this.hitFlashDuration;
      this.updateHitFlash();
      return false;
    }

    this.isDead = true;
    this.sprite.delete();
    return true;
  }

  updateHitFlash() {
    if (this.isDead) return;

    if (this.hitFlashTimer > 0) {
      this.sprite.opacity = this.hitFlashOpacity;
      this.hitFlashTimer--;
      return;
    }

    this.sprite.opacity = this.normalOpacity;
  }

  normalizeVector(vector) {
    let length = Math.hypot(vector.x, vector.y);
    if (length === 0) return { x: 0, y: 0 };

    return {
      x: vector.x / length,
      y: vector.y / length
    };
  }

  weightedVector(vector, weight) {
    let normalized = this.normalizeVector(vector);

    return {
      x: normalized.x * weight,
      y: normalized.y * weight
    };
  }

  distanceToPlayer() {
    return Math.hypot(
      this.player.sprite.x - this.sprite.x,
      this.player.sprite.y - this.sprite.y
    );
  }

  canSeePlayer() {
    return this.distanceToPlayer() <= this.sightRange;
  }

  isAttacking() {
    return this.attackTimer > 0;
  }

  canReachPlayer() {
    return Math.abs(this.player.sprite.x - this.sprite.x) <= this.attackRange
      && Math.abs(this.player.sprite.y - this.sprite.y) <= this.attackHeightRange;
  }

  canStartAttack() {
    return this.attackCooldownTimer <= 0
      && this.player.isAlive?.()
      && this.canReachPlayer();
  }

  startAttack() {
    this.sprite.vel.x = 0;
    this.attackTimer = this.attackDuration;
    this.attackCooldownTimer = this.attackCooldown;
    this.attackHasHit = false;
    this.face(Math.sign(this.player.sprite.x - this.sprite.x));
    this.setAnimation('attack1');
  }

  updateAttackTimers() {
    if (this.attackCooldownTimer > 0) this.attackCooldownTimer--;
    if (this.attackTimer <= 0) return;

    this.attackTimer--;
    this.sprite.vel.x = 0;
    this.face(Math.sign(this.player.sprite.x - this.sprite.x));
    this.setAnimation('attack1');

    if (!this.attackHasHit && this.attackTimer <= this.attackHitFrame && this.canReachPlayer()) {
      this.player.takeDamage?.(this.attackDamage, this.sprite.x);
      this.attackHasHit = true;
    }
  }

  face(direction) {
    if (direction === 0) return;

    this.facingDirection = direction;
    this.updateFacingVisual();
  }

  updateFacingVisual() {
    if (!this.sprite.ani) return;

    let scale = Math.abs(this.sprite.ani.scale?.x || this.sprite.ani.scale || 1);
    this.sprite.ani.scale = {
      x: this.facingDirection * scale,
      y: scale
    };
  }

  getSeekVectors() {
    let toPlayer = {
      x: this.player.sprite.x - this.sprite.x,
      y: this.player.sprite.y - this.sprite.y
    };

    return [
      {
        name: 'playerSeek',
        color: 'lime',
        vector: this.weightedVector({ x: toPlayer.x, y: 0 }, this.vectorWeights.playerSeek)
      },
      {
        name: 'heightSeek',
        color: 'cyan',
        vector: this.weightedVector({ x: 0, y: toPlayer.y }, this.vectorWeights.heightSeek)
      },
      {
        name: 'floorStick',
        color: 'orange',
        vector: this.weightedVector({ x: 0, y: 1 }, this.vectorWeights.floorStick)
      }
    ];
  }

  combineVectors(vectors) {
    return vectors.reduce((combined, vector) => {
      return {
        x: combined.x + vector.vector.x,
        y: combined.y + vector.vector.y
      };
    }, { x: 0, y: 0 });
  }

  getDebugVectors() {
    if (this.isDead) return [];
    if (!this.canSeePlayer()) return [];

    let seekVectors = this.getSeekVectors();
    let combined = this.combineVectors(seekVectors);
    let desiredDirection = this.normalizeVector(combined);

    return [
      ...seekVectors,
      {
        name: 'combined',
        color: 'white',
        vector: desiredDirection
      }
    ];
  }

  move() {
    this.updateHitFlash();

    if (this.isDead) return;

    this.updateAttackTimers();

    if (this.isAttacking()) return;

    if (!this.player.isAlive?.()) {
      this.sprite.vel.x = 0;
      this.setAnimation('idle');
      return;
    }

    if (!this.canSeePlayer()) {
      this.sprite.vel.x = 0;
      this.setAnimation('idle');
      return;
    }

    if (this.canStartAttack()) {
      this.startAttack();
      return;
    }

    let desiredDirection = this.normalizeVector(this.combineVectors(this.getSeekVectors()));

    this.sprite.vel.x = desiredDirection.x * this.maxSpeed;
    this.face(Math.sign(this.sprite.vel.x));
    this.updateAnimation();

    if (desiredDirection.y < -0.2 && this.isTouchingFloor()) {
      this.sprite.vel.y = desiredDirection.y * this.jumpStrength;
    }
  }

  updateAnimation() {
    let animationName = this.isAttacking() ? 'attack1' : Math.abs(this.sprite.vel.x) > 0.1 ? 'run' : 'idle';
    this.setAnimation(animationName);
  }

  setAnimation(animationName) {
    if (this.currentAnimation === animationName) return;

    if (!this.sprite.anis?.[animationName]) {
      this._missingAnimations ??= {};
      if (!this._missingAnimations[animationName]) {
        console.warn('Missing animation', animationName, {
          isBoss: this.isBoss,
          character: this.config.character
        });
        this._missingAnimations[animationName] = true;
      }
      return;
    }

    this.currentAnimation = animationName;
    this.sprite.changeAni(animationName);
    this.updateFacingVisual();
  }
}

export class BossEnemy extends Enemy {
  constructor(player, x = 0, y = -220) {
    super(player, x, y, {
      character: 'Demon_Slime',
      health: 35,
      maxSpeed: 0.7,
      attackDamage: 2,
      attackRange: 95,
      attackHeightRange: 120,
      w: 110,
      h: 120,
      animationScale: 2,
      isBoss: true
    });

    this.isBoss = true;
    this.currentAnimation = '';
    this.attackDuration = 60;
    this.attackHitFrame = 26;
    this.attackCooldown = 95;
    this.sightRange = 1200;
    this.landingComplete = false;
  }

  facePlayer() {
    this.facingDirection = this.player.sprite.x >= this.sprite.x ? 1 : -1;
    this.updateFacingVisual();
  }

  updateFacingVisual() {
    if (!this.sprite.ani) return;

    let aniScaleX = this.sprite.ani.scale?.x ?? this.sprite.ani.scale ?? 1;
    let aniScaleY = this.sprite.ani.scale?.y ?? this.sprite.ani.scale ?? 1;

    this.sprite.ani.scale = {
      x: Math.abs(aniScaleX),
      y: Math.abs(aniScaleY)
    };

    this.sprite.scale = {
      x: -1*this.facingDirection,
      y: 1
    };
  }

  move() {
    this.updateHitFlash();

    if (this.isDead) return;

    if (!this.landingComplete) {
      this.facePlayer();
      this.sprite.vel.x = 0;
      this.setAnimation('idle');
      if (this.isTouchingFloor()) this.landingComplete = true;
      return;
    }

    this.facePlayer();
    super.move();
  }
}
