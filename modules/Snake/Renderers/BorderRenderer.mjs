export default class BorderRenderer {
  constructor(params) {
    this.fillStyle = params.fillStyle;
  }

  render(context, object) {
    context.fillStyle = this.fillStyle;
    for (const dimens of object.collisionDimensions) {
      context.fillRect(object.position.x + dimens.offset.x, object.position.y + dimens.offset.y,
        dimens.dimensions.width, dimens.dimensions.height);
    }
  }
}
