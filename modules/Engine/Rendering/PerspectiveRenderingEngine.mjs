import RenderingEngine from "./RenderingEngine.mjs"
import { SURFACE_TYPE } from "../Physics/PhysicsConstants.mjs"
import Bounds from "../GameObject/Bounds.mjs"
import Vec3 from "../GameObject/Vec3.mjs"
import Dimensions from "../GameObject/Dimensions.mjs"

export default class PerspectiveRenderingEngine extends RenderingEngine{
  constructor(params) {
    super(params);
  }

  renderFaded(object, elapsedTime) {
    if (object.fadeDimensions) {
      this.context.globalAlpha = 0.5;
      //object.render(this.context, elapsedTime);
      object.render(this.context, elapsedTime, object.fadeDimensions);
      let offset = object.fadeDimensions.offset || new Vec3();
      let dimensions = object.fadeDimensions.dimensions || new Dimensions();

      this.context.globalAlpha = 1;
      object.render(this.context, 0, {
        offset: offset.plus({ y: dimensions.height }),
        dimensions: {
          width: object.dimensions.width,
          height: object.dimensions.height - dimensions.height
        }
      });
    } else {
      this.context.globalAlpha = 0.5;
      object.render(this.context, elapsedTime);
    }
  }

  renderObject(object, elapsedTime, center, clipping) {
    this.context.save();
    if (object.losFade && object.fadePosition.y > center.y - 20) {
      this.renderFaded(object, elapsedTime, clipping);
    } else {
      object.render(this.context, elapsedTime, clipping);
    }
    this.context.restore();
  }

  sortClips(clip) {
    return clip.object.position.z + clip.object.dimensions.zheight;
  }

  // Render highest to lowest y
  render(objects, elapsedTime, center) {
    //window.debug = true;
    this.context.save();

    // if (center) {
    //   this.context.translate(-(center.x - this.context.canvas.width / 2), -(center.y - this.context.canvas.height / 2));
    // }

    let renderObjects = this.getRenderObjects(objects, center);
    let clips = [];
    //for (const object of renderObjects) {
    let y, obj;
    for (y = 0; y < renderObjects.length; y++) {
      if (!renderObjects[y]) continue;
      for (obj = 0; obj < renderObjects[y].length; obj++) {
        let object = renderObjects[y][obj];
        if (object.renderClipped) {
          clips.push({
            object: object,
            bottom: y + object.height,
            top: y,
            previousClip: 0
          });
          clips = _.sortBy(clips, this.sortClips);
          continue;
        }

        for (const clip of clips) {
          let height = 0;
          if (y >= clip.bottom) {
            height = clip.object.height - clip.previousClip;
          } else {
            height = Math.round(Math.min(clip.object.height - clip.previousClip,
              (y - clip.top - clip.previousClip) - clip.object.zheight));
          }

          if (height > 0) {
            let clipping = {
              offset: new Vec3({
                x: 0,
                y: clip.previousClip
              }),
              dimensions: new Dimensions({
                width: clip.object.width,
                height: height + 1 // TRICKY: add 1 to prevent one off rendering artifacts
              })
            };
            // TODO: reset elapsed time after first render?
            this.renderObject(clip.object, elapsedTime, center, clipping);

            clip.previousClip += height;
            if (clip.previousClip >= clip.object.height) {
              _.pull(clips, clip);
            }
          }
        }

        this.renderObject(object, elapsedTime, center);
      }
    }

    for (const clip of clips) {
      let clipping = {
        offset: new Vec3({
          x: 0,
          y: clip.previousClip
        }),
        dimensions: new Dimensions({
          width: clip.object.width,
          height: clip.object.height - clip.previousClip
        })
      };
      this.renderObject(clip.object, elapsedTime, center, clipping);
    }
    
    this.debugBoxes(renderObjects);

    
    // let pos = {
    //   x: 600,
    //   y: 600
    // };
    // let radius = 1000;
    // //this.context.globalCompositeOperation='difference';

    // this.context.globalCompositeOperation='saturation';
    // this.context.fillStyle = "hsl(0, 100%, 1%)";
    // // let gradient2 = this.context.createRadialGradient(pos.x, pos.x, radius,
    // //   pos.x, pos.y, 0);
    // // this.context.globalAlpha = 1;
    // // gradient2.addColorStop(0.5, "transparent");
    // // gradient2.addColorStop(0.25, "white");
    // // this.context.fillStyle = gradient2;
    // this.context.fillRect(pos.x - radius, pos.y - radius,
    //   radius * 2, radius * 2);

    this.context.restore();
  }
  
  sortByPerspective(obj) {
    return obj.perspectivePosition.y;
  }

  debugBoxes(objects) {
    if (window.debug) {
      for (const objSets of objects) {
        if (!objSets) continue;
        for (const object of objSets) {
          if (object.particles) continue;

          this.context.fillStyle = "black";
          this.context.beginPath();
          this.context.arc(object.position.x, object.position.y, 2, 0, 2 * Math.PI);
          this.context.closePath();
          this.context.fill();

          // this.context.fillStyle = "purple";
          // this.context.beginPath();
          // this.context.arc(object.perspectivePosition.x, object.perspectivePosition.y, 5, 0, 2 * Math.PI);
          // this.context.closePath();
          // this.context.fill();

          let perspectivePosition = object.perspectivePosition;
          if (perspectivePosition) {
            this.context.strokeStyle = "purple";
            this.context.strokeRect(perspectivePosition.x, perspectivePosition.y,
              object.width, object.height);
          }

          let box = object.boundingBox;
          if (box) {
            this.context.strokeStyle = "yellow";
            this.context.strokeRect(box.ul.x, box.ul.y, box.width, box.height);
          }
            
          for (const bounds of object.lastCollisionBounds) {
            if (!bounds.box) continue; // TODO: render ray bounds
            this.context.strokeStyle = "lawnGreen";
            this.context.strokeRect(bounds.ul.x, bounds.ul.y - bounds.ul.z,
              bounds.width, bounds.height);
          }

          for (const bounds of object.collisionBounds) {
            if (!bounds.box) continue; // TODO: render ray bounds
            this.context.strokeStyle = "crimson";
            this.context.strokeRect(bounds.ul.x, bounds.ul.y - bounds.ul.z,
              bounds.width, bounds.height);
          }

          // for (let i = 0; i < object.collisionBounds.length; i++) {
          //   this.context.strokeStyle = "blue";
          //   let bounds = object.lastCollisionBounds[i].plus(object.collisionBounds[i]);
          //   this.context.strokeRect(bounds.ul.x, bounds.ul.y - bounds.ul.z,
          //     bounds.width, bounds.height);
          // }
          // for (const terrainBox of object.terrainBoundingBox) {
          //   this.context.strokeStyle = "lawnGreen";
          //   this.context.strokeRect(terrainBox.ul.x, terrainBox.ul.y, terrainBox.width, terrainBox.height);
          // }
          // for (const hitbox of object.hitbox) {
          //   this.context.strokeStyle = "crimson";
          //   this.context.strokeRect(hitbox.ul.x, hitbox.ul.y, hitbox.width, hitbox.height);
          // }
          // for (const losBox of object.losBoundingBox) {
          //   this.context.strokeStyle = "aqua";
          //   this.context.strokeRect(losBox.ul.x, losBox.ul.y, losBox.width, losBox.height);
          // }
        }
      }
    }
  }

  getRenderObjects(objects, center) {
    let renderObjects = [];
    let characters = [];
    let losBounds = [];
    for (const object of objects) {
      for (const renderObj of object.renderObjects) {
        // TODO: create new grid for rendering
        if (renderObj.visible &&
            (renderObj.position.x + renderObj.width > center.x - this.context.canvas.width && renderObj.position.x + renderObj.width < center.x + this.context.canvas.width &&
             renderObj.position.y + renderObj.height > center.y - this.context.canvas.height && renderObj.position.y + renderObj.height < center.y + this.context.canvas.height ||
             renderObj.lastPosition.x + renderObj.width > center.x - this.context.canvas.width && renderObj.lastPosition.x + renderObj.width < center.x + this.context.canvas.width &&
             renderObj.lastPosition.y + renderObj.height > center.y - this.context.canvas.height && renderObj.lastPosition.y + renderObj.height < center.y + this.context.canvas.height))
        {
          let pos = Math.round(renderObj.perspectivePosition.y);
          if (!renderObjects[pos]) {
            renderObjects[pos] = [];
          }
          renderObjects[pos].push(renderObj);
        }
      }

      //if (object.physics.surfaceType !== SURFACE_TYPE.CHARACTER || object.isThisPlayer) {
      // } else {
      //   characters.push(object);
      // }
    }
    
    //renderObjects = renderObjects.concat(this.getCharactersInFov(characters, center));

    //return _.sortBy(renderObjects, this.sortByY, this.sortByZ);
    //return _.sortBy(renderObjects, this.sortByPerspective);
    return renderObjects;
  }

  getCharactersInFov(objects, center) {
    let characters = [];
    let centerBox = new Bounds({
      position: center.plus({ y: 12, x: -16 }),
      dimensions: {
        width: 32,
        height: 20
      }
    });
    let losBounds = _.reduce(objects, (bounds, obj) => bounds.concat(obj.losBounds), []);
    for (const obj of objects) {
      if (obj.physics.surfaceType === SURFACE_TYPE.CHARACTER && !obj.isThisPlayer) {
        let lines = [];

        this.context.strokeStyle = "magenta";
        // TODO: consider creating losDimensions instead of using collisionDimensions
        for (const bounds of obj.collisionBounds) {
          _.each(bounds.box, (point) => {
            _.each(centerBox.box, (centerPoint) => {
              lines.push([point, centerPoint]);

              if (window.debug) {
                // DEBUG
                this.context.beginPath();
                this.context.moveTo(point.x, point.y);
                this.context.lineTo(centerPoint.x, centerPoint.y);
                this.context.stroke();
              }
            });
          });
        }

        let opacities = lines.map((line) => {
          return losBounds.reduce(
            (op, bounds) => bounds.intersects(line) ? op + (bounds.opacity || 0) : op, 0);
        });

        if (_.min(opacities) < 1) {
          characters.push(obj);
        }

        // If not every los line is intersected (i.e. blocked) by a los bounding box then
        // the character is in view
        // if (!lines.every((line) => losBounds.some((bounds) => bounds.intersects(line)))) {
        //   characters.push(obj);
        // }
      }
    }

    return characters;
  }
}
