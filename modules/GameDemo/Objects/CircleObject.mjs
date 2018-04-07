import GameObject from "../../Engine/GameObject/GameObject.mjs"
import CircleRenderer from "../../Engine/Rendering/Renderers/CircleRenderer.mjs"

export default class CircleObject extends GameObject {
  constructor(params) {
    super(params);
    this.renderer = new CircleRenderer({
      radius: 10,
      strokeStyle: "blue",
      fillStyle: "red"
    });
  }
}
