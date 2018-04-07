import GameObject from "../../Engine/GameObject/GameObject.mjs"
import BorderRenderer from "../Renderers/BorderRenderer.mjs"
import Vec3 from "../../Engine/GameObject/Vec3.mjs"

export default class Border extends GameObject {
  constructor(params) {
    super(params);
    this.position = new Vec3({ x: 0, y: 0 });
    this.collisionDimensions = [
      // Top
      {
        offset: {
          x: 0,
          y: 0
        },
        dimensions: {
          width: 1000,
          height: 20
        }
      },
      // Right
      {
        offset: {
          x: 980,
          y: 0
        },
        dimensions: {
          width: 20,
          height: 1000
        }
      },
      // Bottom
      {
        offset: {
          x: 0,
          y: 980
        },
        dimensions: {
          width: 1000,
          height: 20
        }
      },
      // Left
      {
        offset: {
          x: 0,
          y: 0
        },
        dimensions: {
          width: 20,
          height: 1000
        }
      }
    ]
    this.renderer = new BorderRenderer({
      fillStyle: "red"
    });
  }
}
