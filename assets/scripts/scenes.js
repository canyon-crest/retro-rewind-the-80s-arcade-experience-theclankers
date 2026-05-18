import { Floor, Wall } from './envObjects.js'

export function drawScenes() {
  let floor = new Floor(20, 100000, 5);
  let wall = new Wall(0, 0, 5, 10000000);
}