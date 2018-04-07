export default class SnakeRenderer {
  constructor(params) {
    this.fillStyle = params.fillStyle;
    this.strokeStyle = params.strokeStyle;
    this.dimensions = params.dimensions;
  }

  render(context, object) {
    context.save();
    context.lineWidth = 2;

    for (const part of object.parts) {
      if (this.fillStyle) {
        context.fillStyle = this.fillStyle;
        context.fillRect(part.x, part.y,
          this.dimensions.width, this.dimensions.height);
      }

      if (this.strokeStyle) {
        context.strokeStyle = this.strokeStyle;
        context.strokeRect(part.x, part.y,
          this.dimensions.width, this.dimensions.height);
      }
    }
    
    context.restore();    
  }
}
