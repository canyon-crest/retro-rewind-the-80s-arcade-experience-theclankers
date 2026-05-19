import { Floor, Wall } from './envObjects.js';
import { ABILITIES, loadSaveData, saveSaveData } from './saveData.js';
import { addCharacterAnimations } from './animation.js';

export class Player {
  constructor() {
    this.sprite = new Sprite();
    this.sprite.y = -70;
    this.sprite.w = 30;
    this.sprite.h = 120;
    this.sprite.rotationLock = true;
    addCharacterAnimations(this.sprite, 'Samurai');


    this.sprite.anis.idle.scale = 2;
    this.sprite.anis.run.scale = 2;

    this.saveData = loadSaveData();
    this.abilities = this.saveData.abilities;
    this.facingDirection = 1;
    this.currentAnimation = '';
    this.dashSpeed = 14;
    this.dashDuration = 10;
    this.dashCooldown = 35;
    this.dashTimer = 0;
    this.dashCooldownTimer = 0;
    this.airDashAvailable = true;
    this.doubleJumpAvailable = true;
    this.jumpSpeed = 5;
    this.doubleJumpSpeed = 5.5;
    this.wallJumpHorizontalSpeed = 8;
    this.wallJumpVerticalSpeed = 7;
    this.wallJumpControlLock = 0;
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

  setAnimation(animationName) {
    if (this.currentAnimation === animationName) return;

    this.currentAnimation = animationName;
    this.sprite.changeAni(animationName);
    this.updateFacingVisual();
  }

  updateAnimation() {

    if (this.isDashing() || Math.abs(this.sprite.vel.x) > 0.1) {
      this.setAnimation('run');
      return;
    }

    this.setAnimation('idle');
  }

  snapToFloor() {
    if (this.sprite.vel.y < 0) return;

    for (let floor of Floor.all) {
      let playerBottom = this.sprite.y + this.sprite.h / 2;
      let floorTop = floor.sprite.y - floor.sprite.h / 2;
      let floorLeft = floor.sprite.x - floor.sprite.w / 2;
      let floorRight = floor.sprite.x + floor.sprite.w / 2;
      let playerOverFloor = this.sprite.x >= floorLeft && this.sprite.x <= floorRight;
      let closeToFloor = playerBottom >= floorTop && playerBottom <= floorTop + 20;

      if (playerOverFloor && closeToFloor) {
        this.sprite.y = floorTop - this.sprite.h / 2;
        this.sprite.vel.y = 0;
        return;
      }
    }
  }

  isTouchingFloor() {
    return Floor.touching(this.sprite);
  }

  wallJumpDirection() {
    return Wall.jumpDirection(this.sprite);
  }

  hasAbility(ability) {
    return this.abilities[ability] === true;
  }

  unlockAbility(ability) {
    if (!Object.values(ABILITIES).includes(ability)) return false;

    this.abilities[ability] = true;
    this.save();
    return true;
  }

  lockAbility(ability) {
    if (!Object.values(ABILITIES).includes(ability)) return false;

    this.abilities[ability] = false;
    this.save();
    return true;
  }

  save() {
    this.saveData = saveSaveData({
      ...this.saveData,
      abilities: this.abilities
    });
    this.abilities = this.saveData.abilities;
  }

  canDash() {
    return this.hasAbility(ABILITIES.DASH)
      && this.dashCooldownTimer <= 0
      && this.dashTimer <= 0
      && (this.isTouchingFloor() || this.airDashAvailable);
  }

  isDashing() {
    return this.dashTimer > 0;
  }

  startDash() {
    if (!this.canDash()) return false;

    if (!this.isTouchingFloor()) this.airDashAvailable = false;

    this.dashTimer = this.dashDuration;
    this.dashCooldownTimer = this.dashCooldown;
    this.sprite.vel.x = this.facingDirection * this.dashSpeed;
    this.sprite.vel.y = 0;
    return true;
  }

  updateDashTimers() {
    if (this.dashTimer > 0) this.dashTimer--;
    if (this.dashCooldownTimer > 0) this.dashCooldownTimer--;
  }

  canWallJump() {
    return this.hasAbility(ABILITIES.WALL_CLING) && !this.isTouchingFloor() && this.wallJumpDirection() !== 0;
  }

  canDoubleJump() {
    return this.hasAbility(ABILITIES.DOUBLE_JUMP) && !this.isTouchingFloor() && this.doubleJumpAvailable;
  }

  startDoubleJump() {
    if (!this.canDoubleJump()) return false;

    this.sprite.vel.y = -1 * this.doubleJumpSpeed;
    this.doubleJumpAvailable = false;
    return true;
  }

  startWallJump() {
    if (!this.canWallJump()) return false;

    let jumpDirection = this.wallJumpDirection();
    this.sprite.vel.x = jumpDirection * this.wallJumpHorizontalSpeed;
    this.sprite.vel.y = -1 * this.wallJumpVerticalSpeed;
    this.face(jumpDirection);
    this.wallJumpControlLock = 8;
    return true;
  }

  jump() {
    if (this.isTouchingFloor()) {
      this.sprite.vel.y = -1 * this.jumpSpeed;
      return true;
    }

    return this.startWallJump() || this.startDoubleJump();
  }

  move() {
    this.updateDashTimers();
    this.snapToFloor();

    if (this.isTouchingFloor() || this.wallJumpDirection() !== 0) {
      this.airDashAvailable = true;
      this.doubleJumpAvailable = true;
    }

    if (this.wallJumpControlLock > 0) this.wallJumpControlLock--;

    if (this.isDashing()) {
      this.sprite.vel.x = this.facingDirection * this.dashSpeed;
      this.sprite.vel.y = 0;
      this.updateAnimation();
      return;
    }

    if (this.wallJumpControlLock <= 0) this.sprite.vel.x = 0;

    let horVel = 5;
    if (this.wallJumpControlLock <= 0 && kb.pressing('left')) {
      this.sprite.vel.x = -1 * horVel;
      this.face(-1);
    }
    
    if (this.wallJumpControlLock <= 0 && kb.pressing('right')) {
      this.sprite.vel.x = horVel;
      this.face(1);
    }

    if (kb.presses('z')) this.jump();

    if (kb.presses('c')) this.startDash();

    this.updateAnimation();
  }
}
