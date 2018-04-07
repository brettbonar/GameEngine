import Dimensions from "./Dimensions.mjs";

export default class Vec3 {
  constructor(params) {
    Object.assign(this, params);
    _.defaults(this, {
      x: 0,
      y: 0,
      z: 0
    });
  }

  static normalize(point) {
    if (point) {
      let norm = Math.sqrt(point.x * point.x + point.y * point.y);
      if (norm !== 0) {
        return {
          x: point.x / norm,
          y: point.y / norm,
          // Don't normalize Z for now
          z: point.z
        }
      }
    }
    return point;
  }

  normalize() {
    return Object.assign(this, Vec3.normalize(this));
  }

  distanceTo(point) {
    let dx = this.x - point.x;
    let dy = this.y - point.y;
    let dz = (this.z - point.z) || 0;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // Checks that all parts have the same sign
  sameAs(point) {
    return Math.sign(this.x) === Math.sign(point.x) &&
      Math.sign(this.y) === Math.sign(point.y) &&
      Math.sign(this.z) === Math.sign(point.z);
  }

  equals(point) {
    return this.x === point.x && this.y === point.y && this.z === point.z;
  }

  scale(scale) {
    this.x = this.x * scale;
    this.y = this.y * scale;
    this.z = this.z * scale;
    return this;
  }

  times(scale) {
    return new Vec3({
      x: this.x * scale,
      y: this.y * scale,
      z: this.z * scale
    });
  }

  times2D(scale) {
    return new Vec3({
      x: this.x * scale,
      y: this.y * scale,
      z: this.z
    });
  }

  copy() {
    return new Vec3({
      x: this.x,
      y: this.y,
      z: this.z
    });
  }

  add(point) {
    if (point) {
      this.x += point.x || 0;
      this.y += point.y || 0;
      this.z += point.z || 0;
    }
    return this;
  }
  
  subtract(point) {
    if (point) {
      this.x -= point.x || 0;
      this.y -= point.y || 0;
      this.z -= point.z || 0;
    }
    return this;
  }
  
  plus(point) {
    if (point) {
      if (point instanceof Vec3 || !_.isUndefined(point.x) || !_.isUndefined(point.y) || !_.isUndefined(point.z)) {
        return new Vec3({
          x: this.x + (point.x || 0),
          y: this.y + (point.y || 0),
          z: this.z + (point.z || 0)
        });
      } else if (point instanceof Dimensions || !_.isUndefined(point.width) || !_.isUndefined(point.height) || !_.isUndefined(point.zheight)) {
        return new Vec3({
          x: this.x + (point.width || 0),
          y: this.y + (point.height || 0),
          z: this.z + (point.zheight || 0)
        });
      }
    }
    return new Vec3(this);
  }
  
  minus(point) {
    if (point) {
      return new Vec3({
        x: this.x - (point.x || 0),
        y: this.y - (point.y || 0),
        z: this.z - (point.z || 0)
      });
    }
    return new Vec3(this);
  }
}
