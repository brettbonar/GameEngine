//let renderFunctions = {};

export default class RenderingEngine {
  constructor(params) {
    _.merge(this, params);
  }

  render(objects, elapsedTime) {}
  
  // render(elapsedTime, objects) {
  //   for (const object of objects) {
  //     // TODO: make sure constructor.name will work for all cases
  //     _.invoke(renderFunctions, [this.constructor.name, object.constructor.name].join("."),
  //       elapsedTime, object, this);
  //   }
  // }

  // static addRenderFn(renderType, objectType, fn) {
  //   let renderer = renderFunctions[renderType];
  //   if (!renderer) {
  //     renderer = {};
  //     renderFunctions[renderType] = renderer;
  //   }

  //   renderer[objectType] = fn;
  // }
}
