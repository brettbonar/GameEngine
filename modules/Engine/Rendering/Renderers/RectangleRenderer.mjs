import Renderer from "./Renderer.mjs"

export default class RectangleRenderer extends Renderer {
  constructor(params) {
    super(params);
    this.dimensions = params.dimensions;
    this.fillStyle = params.fillStyle;
    this.strokeStyle = params.strokeStyle;
  }

  render(context, object, elapsedTime) {
    context.save();
    context.lineWidth = 2;

    if (this.fillStyle) {
      context.fillStyle = this.fillStyle;
      context.fillRect(object.position.x, object.position.y,
        this.dimensions.width, this.dimensions.height);
    }

    if (this.strokeStyle) {
      context.strokeStyle = this.strokeStyle;
      context.strokeRect(object.position.x, object.position.y,
        this.dimensions.width, this.dimensions.height);
    }
    
    context.restore();    
  }
}
