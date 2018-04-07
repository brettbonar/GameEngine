import Renderer from "./Renderer.mjs"

export default class CircleRenderer extends Renderer {
  constructor(params) {
    super(params);
    _.merge(this, params);
  }

  render(context, object, elapsedTime) {
    let position = object.position;
    context.save();

    context.beginPath();
    context.arc(position.x, position.y, this.radius, 0, 2 * Math.PI);
    context.closePath();

    context.shadowColor = this.shadowColor;
    context.shadowBlur = this.shadowBlur;

    if (this.fillStyle) {
      context.fillStyle = this.fillStyle;
      context.fill();
    }

    if (this.strokeStyle) {
      context.strokeStyle = this.strokeStyle;
      context.stroke();
    }
    
    context.restore();
  }
}
