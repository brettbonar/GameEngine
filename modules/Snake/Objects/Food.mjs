import GameObject from "../../Engine/GameObject/GameObject.mjs"
import RectangleRenderer from "../../Engine/Rendering/Renderers/RectangleRenderer.mjs"

export default class Food extends GameObject {
  constructor(params) {
    super(params);
    this.renderer = new RectangleRenderer({
      strokeStyle: "black",
      fillStyle: "orange",
      dimensions: {
        width: 20,
        height: 20
      }
    });
  }
}
