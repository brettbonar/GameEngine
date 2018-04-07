export default class Dimensions {
  constructor(params) {
    Object.assign(this, params);
    _.defaults(this, {
      width: 0,
      height: 0,
      zheight: 0
    });
  }

  plus(dimensions) {
    return new Dimensions({
      width: this.width + dimensions.width,
      height: this.height + dimensions.height,
      zheight: this.zheight + dimensions.zheight
    });
  }

  copy() {
    return new Dimensions({
      width: this.width,
      height: this.height,
      zheight: this.zheight
    });
  }
}
