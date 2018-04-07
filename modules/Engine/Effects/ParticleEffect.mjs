import Vec3 from "../GameObject/Vec3.mjs"
import ImageCache from "../Rendering/ImageCache.mjs"

class Particle {
  constructor(params) {
    _.merge(this, params);
    this.currentTime = 0;
    this.image = ImageCache.get(this.particleInfo.imageSource);
    this.rotation = Math.atan2(this.direction.y - this.direction.z, this.direction.x ) * 180 / Math.PI;
    this.rotationDiff = 0;
    this.visible = true;

    if (this.particleInfo.minDuration || this.particleInfo.maxDuration) {
      this.duration = _.random(this.particleInfo.minDuration, this.particleInfo.maxDuration);
    } else {
      this.duration = this.particleInfo.duration || 0;
    }

    if (this.particleInfo.minSpeed || this.particleInfo.maxSpeed) {
      this.speed = _.random(this.particleInfo.minSpeed, this.particleInfo.maxSpeed);
    } else {
      this.speed = this.particleInfo.speed || 0;
    }
    this.zspeed = this.particleInfo.zspeed || this.speed;

    if (this.particleInfo.acceleration) {
      this.particleInfo.acceleration = new Vec3(this.particleInfo.acceleration);
    }
  }

  get width() {
    return this.particleInfo.dimensions.width;
  }

  get height() {
    return this.particleInfo.dimensions.height;
  }

  get perspectivePosition() { return this.position; }

  update(elapsedTime) {
    let timestep = elapsedTime / 1000;
    this.currentTime += elapsedTime;

    let groundSpeed = this.speed * timestep;
    if (this.direction) {
      this.position.add({
        x: this.direction.x * groundSpeed,
        y: this.direction.y * groundSpeed,
        z: this.direction.z * this.zspeed * timestep
      });
      if (this.position.z <= 0) {
        this.position.z = 0;

        if (this.particleInfo.elasticity) {
          this.direction.z = -this.direction.z * this.particleInfo.elasticity;
          if (Math.abs(this.direction.z) < 0.15) this.direction.z = 0;
        }

        if (this.particleInfo.stickiness) {
          this.direction.subtract(this.direction.times(this.particleInfo.stickiness));
        }
      }

      if (this.particleInfo.friction > 0 && this.position.z === 0) {
        if (this.particleInfo.friction === Infinity) {
          this.speed = 0;
        } else {
          let amount = this.speed * timestep;
          this.speed -= this.speed * timestep * this.particleInfo.friction;
          if (this.speed < 1) {
            this.speed = 0;
          }
        }
      }
    }

    if (this.particleInfo.acceleration) {
      this.direction.add({
        x: this.particleInfo.acceleration.x * groundSpeed,
        y: this.particleInfo.acceleration.y * groundSpeed,
        z: this.particleInfo.acceleration.z * this.zspeed * timestep
      });
      //this.direction.add(this.particleInfo.acceleration.times(this.speed * timestep));
    }

    if (this.spin) {
      this.rotationDiff += this.spin * timestep;
      this.rotation += this.rotationDiff;
    }
    this.rotation = Math.atan2(this.direction.y - this.direction.z, this.direction.x ) * 180 / Math.PI;

    if (this.currentTime >= this.duration) {
      this.done = true;
    }
  }

  render(context, elapsedTime) {
    // TODO: allow animated particles
    if (!this.image.complete) {
      return;
    }
    //let offset = getAnimationOffset(this.image, this.projectile.imageSize, this.frame);

    // if (this.projectile.shadow) {
    //   drawShadow(context, object, this.projectile.modelDimensions, this.projectile.shadowColor);
    // }

    let position = this.position.minus({ y: this.position.z });

    context.save();
    
    if (this.rotation) {
      let center = position.plus({ x: this.particleInfo.dimensions.width / 2, y: this.particleInfo.dimensions.height / 2 });
      context.translate(center.x, center.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-center.x, -center.y);        
    }
    
    context.drawImage(this.image, position.x, position.y,
      this.particleInfo.dimensions.width, this.particleInfo.dimensions.height);

    context.restore();
  }
}

export default class ParticleEffect {
  constructor(params) {
    this.currentTime = 0;
    this.particleTime = 0;
    this.particles = [];
    this.position = params.position;
    this.direction = params.direction;
    this.speed = params.speed;
    this.particleInfo = params.effect.particles;
    this.frequency = params.effect.frequency;
    this.radius = params.effect.radius;
    this.duration = params.effect.duration;
    this.visible = true;

    if (params.effect.initialCount) {
      for (let i = 0; i < params.effect.initialCount; i++) {
        this.createParticle();
      }
    }
  }

  createParticle() {
    let position = this.position.copy();
    let direction = new Vec3();

    if (this.particleInfo.momentum) {
      // TODO: vary this a bit
      direction.add(this.direction);
    } else if (!this.particleInfo.baseDirection) {
      direction.add({
        x: _.random(-1, 1, true),
        y: _.random(-1, 1, true),
        z: _.random(-1, 1, true)
      });
    }

    if (this.particleInfo.baseDirection) {
      direction.add({
        x: _.random(this.particleInfo.baseDirection.min.x, this.particleInfo.baseDirection.max.x, true),
        y: _.random(this.particleInfo.baseDirection.min.y, this.particleInfo.baseDirection.max.y, true),
        z: _.random(this.particleInfo.baseDirection.min.z, this.particleInfo.baseDirection.max.z, true)
      });
    }
    direction.normalize()

    if (this.radius) {
      position.add(direction.times(_.random(0, this.radius)));
    }
    this.particles.push(new Particle({
      position: position,
      direction: direction,
      particleInfo: this.particleInfo
    }));
  }

  update(elapsedTime) {
    this.currentTime += elapsedTime;
    this.particleTime += elapsedTime;

    _.remove(this.particles, "done");
    for (const particle of this.particles) {
      particle.update(elapsedTime);
    }

    // TODO: find out how much currentTime is over duration, may need to create some particles
    if (this.currentTime <= this.duration) {
      let numParticles = Math.floor(this.frequency * (this.particleTime / 1000));
      for (let i = 0; i < numParticles; i++) {
        this.createParticle();
      }
      this.particleTime -= numParticles * (1000 / this.frequency);
    }

    if (this.currentTime >= this.duration && this.particles.length === 0) {
      this.done = true;
    }
  }

  get renderObjects() {
    return this.particles;
  }
}
