export default class Renderer {
  /**
   * @param {Object} params
   * @param {string} params.strokeStyle
   * @param {string} params.fillStyle
   * @param {string} params.shadowColor
   * @param {string} params.shadowBlur
   * @param {string} params.lineWidth
   */
  constructor(params) {
    _.merge(this, params);
  }

  render(context, object, elapsedTime) {}
  update(elapsedTime) {}
  setAnimation() {}
}
