import GameObject from "../../Engine/GameObject/GameObject.mjs"
import SnakeRenderer from "../Renderers/SnakeRenderer.mjs"
import Vec3 from "../../Engine/GameObject/Vec3.mjs"

const MOVE_TIME = 150;

export default class Snake extends GameObject {
  constructor(params) {
    super(params);
    this.renderer = new SnakeRenderer({
      strokeStyle: "black",
      fillStyle: "white",
      dimensions: {
        width: 20,
        height: 20
      }
    });

    this.parts = [this.position];
    this.direction = new Vec3({ x: 0, y: 0 });
    this.currentTime = 0;
  }

  move() {
    if (this.direction.x !== 0 || this.direction.y !== 0) {
      for (let i = this.parts.length - 1; i > 0; i--) {
        this.parts[i].x = this.parts[i - 1].x;
        this.parts[i].y = this.parts[i - 1].y;
      }
      this.parts[0] = new Vec3(this.parts[0]).plus(this.direction.times(20));
      this.position = this.parts[0];

      if (this.segmentsToAdd) {
        this.segmentsToAdd--;
        this.parts.push(this.segmentsPosition.copy());
      }
    }
  }

  addSegments(position) {
    this.segmentsToAdd = 3;
    this.segmentsPosition = new Vec3(this.parts[this.parts.length - 1]);
  }

  update(elapsedTime) {
    this.currentTime += elapsedTime;
    if (this.currentTime >= MOVE_TIME) {
      this.move();
      this.currentTime = MOVE_TIME - this.currentTime;
    }
  }
}
