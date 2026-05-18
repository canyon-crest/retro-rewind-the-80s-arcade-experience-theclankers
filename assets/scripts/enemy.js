import { Floor } from './envObjects.js';

export class Enemy {
  constructor(player) {
    this.player = player;
    this.sprite = new Sprite();
    this.sprite.diameter = 50;
    this.sprite.y = -70;
    this.sprite.x = 350;
    this.sprite.fill = 'black';

    this.maxSpeed = 3;
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
    let desiredDirection = this.normalizeVector(this.combineVectors(this.getSeekVectors()));

    this.sprite.vel.x = desiredDirection.x * this.maxSpeed;

    if (desiredDirection.y < -0.2 && this.isTouchingFloor()) {
      this.sprite.vel.y = desiredDirection.y * this.jumpStrength;
    }
  }
}
