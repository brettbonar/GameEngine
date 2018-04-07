class Scratch {
  constructor() {
    if (typeof document !== "undefined") {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 2048;
      this.canvas.height = 2048;
      this.context = this.canvas.getContext("2d");
    }
  }

  put(image, position, dimensions) {
    this.context.drawImage(image, position.x, position.y, dimensions.width, dimensions.height);
  }

  drawImageTo(context, position, dimensions, targetPosition, targetDimensions) {
    context.drawImage(this.canvas, position.x, position.y, dimensions.width, dimensions.height,
      targetPosition.x, targetPosition.y, targetDimensions.width, targetDimensions.height);
  }
}

let scratch = new Scratch();

export default scratch
