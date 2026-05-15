import { DDEBUG } from './globalVar.js'
import { Floor, Wall } from './hitbox.js'

export function debug() {
  Floor.all.forEach(floor => {
    floor.sprite.visible = DDEBUG.full;
  });

  Wall.all.forEach(wall => {
    wall.sprite.visible = DDEBUG.full;
  });
  return DDEBUG.full;
}