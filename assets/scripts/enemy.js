import { Floor } from './envObjects.js';
import { addCharacterAnimations } from './animation.js';

export class Enemy {
  constructor(player, x = 350, y = -70) {
    this.player = player;
    this.sprite = new Sprite();
    this.sprite.w = 30;
    this.sprite.h = 90;
    this.sprite.y = y;
    this.sprite.x = x;
    this.sprite.rotationLock = true;

    addCharacterAnimations(this.sprite, 'Ninja_Peasant');
    this.currentAnimation = '';
    this.sprite.anis.idle.scale = 2;
    this.sprite.anis.run.scale = 2;

    this.health = 2;
    this.isDead = false;
    this.hitFlashTimer = 0;
    this.hitFlashDuration = 6;
    this.normalOpacity = 1;
    this.hitFlashOpacity = 0.45;
    this.maxSpeed = 3;
    this.sightRange = 300;
    this.facingDirection = 1;
    this.jumpStrength = 5;
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
    if (this.isDead) return;

    this.health -= amount;
    if (this.health > 0) {
      this.hitFlashTimer = this.hitFlashDuration;
      this.updateHitFlash();
      return;
    }

    this.isDead = true;
    this.sprite.delete();
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

    if (!this.canSeePlayer()) {
      this.sprite.vel.x = 0;
      this.setAnimation('idle');
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
    let animationName = Math.abs(this.sprite.vel.x) > 0.1 ? 'run' : 'idle';
    this.setAnimation(animationName);
  }

  setAnimation(animationName) {
    if (this.currentAnimation === animationName) return;

    this.currentAnimation = animationName;
    this.sprite.changeAni(animationName);
    this.updateFacingVisual();
  }
}
