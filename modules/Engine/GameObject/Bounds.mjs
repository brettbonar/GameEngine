import Vec3 from "./Vec3.mjs"

const TYPE = {
  RECTANGLE: "rectangle",
  RECTANGLE_UL: "rectangleUl",
  AABB: "aabb",
  CIRCLE: "circle",
  POINT: "point",
  LINE: "line",
  RAY: "ray"
}

export default class Bounds {
  constructor(params, zheight) {
    this.zheight = zheight || 0;
    this.opacity = params.opacity || 0;
    this.type = params.type || TYPE.AABB;
    if (!_.isUndefined(params.ul)) {
      this.constructFromBox(params);
    } else if (!_.isUndefined(params.dimensions.width) && !_.isUndefined(params.dimensions.height)) {
      this.constructFromRectangle(params);
    } else if (!_.isUndefined(params.dimensions.line)) {
      this.constructFromLine(params);
      this.type = TYPE.LINE;
    } else if (!_.isUndefined(params.dimensions.radius)) {
      this.constructFromCircle(params);
    } else if (!_.isUndefined(params.position)) {
      this.position = new Vec3(params.position);
      this.type = TYPE.POINT;
    } else if (!_.isUndefined(params.ul)) {
      this.constructFromBox(params);
    } else {
      console.log("Bad Bounds constructor");
    }
  }

  static get TYPE() { return TYPE; }

  checkZ(z1, zheight1, z2, zheight2) {
    return !_.isNumber(z1) || !_.isNumber(z2) ||
      (z1 <= z2 && z1 + zheight1 >= z2) || (z2 <= z1 && z2 + zheight2 >= z1);
  }
  
  constructFromBox(params) {
    this.box = params;
    this.zheight = params.zheight || 0;
    this.lines = {
      top: [this.box.ul, this.box.ur],
      bottom: [this.box.lr, this.box.ll],
      right: [this.box.ur, this.box.lr],
      left: [this.box.ll, this.box.ul]
    };
  }

  plus(box) {
    let z = Math.min(this.box.ul.z, box.box.ul.z);
    let zheight = Math.max(this.box.ul.z + this.zheight, box.box.ul.z + box.zheight) - z;
    return new Bounds({
      ul: new Vec3({ x: Math.min(this.box.ul.x, box.box.ul.x), y: Math.min(this.box.ul.y, box.box.ul.y), z: z }),
      ur: new Vec3({ x: Math.max(this.box.ur.x, box.box.ur.x), y: Math.min(this.box.ur.y, box.box.ur.y), z: z }),
      lr: new Vec3({ x: Math.max(this.box.lr.x, box.box.lr.x), y: Math.max(this.box.lr.y, box.box.lr.y), z: z }),
      ll: new Vec3({ x: Math.min(this.box.ll.x, box.box.ll.x), y: Math.max(this.box.ll.y, box.box.ll.y), z: z })
    }, zheight);
  }

  extend(box) {
    // TODO: if box instanceof BoundingBox

    let z = Math.min(this.box.ul.z, box.box.ul.z);
    this.zheight = Math.max(this.box.ul.z + this.zheight, box.box.ul.z + box.zheight) - z;
    this.box = {
      ul: new Vec3({ x: Math.min(this.box.ul.x, box.box.ul.x), y: Math.min(this.box.ul.y, box.box.ul.y), z: z }),
      ur: new Vec3({ x: Math.max(this.box.ur.x, box.box.ur.x), y: Math.min(this.box.ur.y, box.box.ur.y), z: z }),
      lr: new Vec3({ x: Math.max(this.box.lr.x, box.box.lr.x), y: Math.max(this.box.lr.y, box.box.lr.y), z: z }),
      ll: new Vec3({ x: Math.min(this.box.ll.x, box.box.ll.x), y: Math.max(this.box.ll.y, box.box.ll.y), z: z })
    };

    this.lines = {
      top: [this.box.ul, this.box.ur],
      bottom: [this.box.lr, this.box.ll],
      right: [this.box.ur, this.box.lr],
      left: [this.box.ll, this.box.ul]
    };

    return this;
  }

  constructFromLine(params) {
    this.lines = [params.dimensions.line];
    let A = params.dimensions.line[0];
    let B = params.dimensions.line[1];
    let z = Math.min(params.dimensions.line[0].z, params.dimensions.line[1].z);
    this.zheight = z + Math.max(params.dimensions.line[0].z, params.dimensions.line[1].z);
    this.box = {
      ul: new Vec3({ x: Math.min(A.x, B.x), y: Math.min(A.y, B.y), z: z}),
      ur: new Vec3({ x: Math.max(A.x, B.x), y: Math.min(A.y, B.y), z: z}),
      lr: new Vec3({ x: Math.max(A.x, B.x), y: Math.max(A.y, B.y), z: z}),
      ll: new Vec3({ x: Math.min(A.x, B.x), y: Math.max(A.y, B.y), z: z})
    };
  }

  constructFromCircle(params) {
    this.box = {
      ul: params.position.plus({ x: -params.dimensions.radius, y: -params.dimensions.radius }),
      ur: params.position.plus({ x: params.dimensions.radius, y: -params.dimensions.radius }),
      lr: params.position.plus({ x: params.dimensions.radius, y: params.dimensions.radius }),
      ll: params.position.plus({ x: -params.dimensions.radius, y: params.dimensions.radius })
    };

    this.lines = {
      top: [this.box.ul, this.box.ur],
      right: [this.box.ur, this.box.lr],
      bottom: [this.box.lr, this.box.ll],
      left: [this.box.ll, this.box.ul]
    };
  }

  constructFromRectangle(params) {
    this.box = {
      ul: new Vec3(params.position),
      ur: params.position.plus({ x: params.dimensions.width }),
      lr: params.position.plus({ x: params.dimensions.width, y: params.dimensions.height }),
      ll: params.position.plus({ y: params.dimensions.height })
    };
    this.zheight = params.dimensions.zheight;

    this.lines = {
      top: [this.box.ul, this.box.ur],
      bottom: [this.box.lr, this.box.ll],
      right: [this.box.ur, this.box.lr],
      left: [this.box.ll, this.box.ul]
    };
  }

  intersectsLine(first, second) {
    //if (_.isNumber(first.z) && _.isNumber(second.z) && Math.floor(first.z) !== Math.floor(second.z)) return;
    let firstZMin = Math.min(first[0].z, first[1].z);
    let firstZMax = Math.max(first[0].z, first[1].z);
    let secondZMin = Math.min(second[0].z, second[1].z);
    let secondZMax = Math.max(second[0].z, second[1].z);
    // Simple inaccurate check to see if Z axis of lines every intersect
    if (!this.checkZ(firstZMin, firstZMax - firstZMin, secondZMin, secondZMax - secondZMin)) return;
    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    var det, gamma, lambda;
    det = (first[1].x - first[0].x) * (second[1].y - second[0].y) - (second[1].x - second[0].x) * (first[1].y - first[0].y);
    if (det === 0) {
      return false;
    } else {
      lambda = ((second[1].y - second[0].y) * (second[1].x - first[0].x) + (second[0].x - second[1].x) * (second[1].y - first[0].y)) / det;
      gamma = ((first[0].y - first[1].y) * (second[1].x - first[0].x) + (first[1].x - first[0].x) * (second[1].y - first[0].y)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  }

  getIntersections(target) {
    if (target instanceof Bounds) {
      if (this.intersects(target)) {
        return target.lines.filter((line) => this.intersects(line));
      }
    } else if (_.isArray(target)) {
      return this.intersects(target) ? [target] : [];
    }
    return [];
  }

  intersectsAxis(target, axis) {
    return this.min[axis] < target.max[axis] && this.max[axis] > target.min[axis];
  }

  intersects(target) {
    // TODO: add circle intersection tests
    if (target instanceof Bounds) {
      if (this.type === TYPE.AABB && target.type === TYPE.AABB) {
        let box = target.box;
        return this.checkZ(this.box.ul.z, this.zheight, box.ul.z, target.zheight) &&
          this.box.ul.x < box.lr.x &&
          this.box.lr.x > box.ul.x &&
          this.box.ul.y < box.lr.y &&
          this.box.lr.y > box.ul.y;
      } else {
        // TODO: do better check
        return _.some(this.lines, (line) => _.some((target.lines), (targetLine) => this.intersectsLine(line, targetLine)));
      }
    } else if (_.isArray(target)) { // Line [{ x, y }, { x, y }]
      return _.some(this.lines, (line) => this.intersectsLine(line, target));
    } else if (!_.isUndefined(target.x) && !_.isUndefined(target.y)) { // Vec3 { x, y }
      return (!_.isNumber(this.box.ul.z) || !_.isNumber(target.z) || Math.floor(target.z) === Math.floor(this.box.ul.z)) &&
        target.x >= this.box.ul.x && target.x <= this.box.lr.x &&
        target.y >= this.box.ul.y && target.y <= this.box.lr.y;
    }

    return false;
  }

  get radius() {
    return this.dimensions.radius ||
      Math.sqrt(this.dimensions.height * this.dimensions.height + this.dimensions.width * this.dimensions.width) / 2;
  }
  
  get ul() {
    return this.box.ul;
  }
  get ur() {
    return this.box.ur;
  }
  get lr() {
    return this.box.lr;
  }
  get ll() {
    return this.box.ll;
  }

  get ztop() {
    return this.box.ul.plus({ z: this.zheight });
  }
  get zbottom() {
    return this.box.lr;
  }
  get top() {
    return this.box.ul;
  }
  get bottom() {
    return this.box.lr;
  }
  get left() {
    return this.box.ul;
  }
  get right() {
    return this.box.lr;
  }

  get center() {
    return new Vec3({
      x: this.left.x + this.width / 2,
      y: this.top.y + this.height / 2,
      z: this.top.z
    });
  }

  get x() { return this.box.ul.x; }
  get y() { return this.box.ul.y; }

  get width() {
    return this.box.ur.x - this.box.ul.x;
  }
  get height() {
    return this.box.ll.y - this.box.ul.y;
  }

  get bounds() {
    return this.bounds;
  }
  get boundingBox() {
    return this.box;
  }

  get max() {
    return new Vec3({
      x: this.box.lr.x,
      y: this.box.lr.y,
      z: this.box.lr.z + this.zheight
    });
  }

  get min() {
    return new Vec3({
      x: this.box.ul.x,
      y: this.box.ul.y,
      z: this.box.ul.z
    });
  }
}
