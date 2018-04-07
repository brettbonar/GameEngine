import GameObject from "../../Engine/GameObject/GameObject.mjs"
import RectangleRenderer from "../../Engine/Rendering/Renderers/RectangleRenderer.mjs"

export default class Barrier extends GameObject {
  constructor(params) {
    super(params);
    this.renderer = new RectangleRenderer({
      strokeStyle: "black",
      fillStyle: "green",
      dimensions: {
        width: 20,
        height: 20
      }
    });
  }
}
