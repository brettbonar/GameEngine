import KEY_CODE from "../util/keyCodes.mjs"
import Game from "../Engine/Game.mjs"
import GameObject from "../Engine/GameObject/GameObject.mjs"
import Vec3 from "../Engine/GameObject/Vec3.mjs"
import Bounds from "../Engine/GameObject/Bounds.mjs"
import FlatRenderingEngine from "../Engine/Rendering/FlatRenderingEngine.mjs"
import Grid from "../Engine/Grid.mjs"
import PhysicsEngine from "../Engine/Physics/PhysicsEngine.mjs"
import CircleObject from "./Objects/CircleObject.mjs"

const EVENTS = {
  MOVE_UP: "moveUp",
  MOVE_DOWN: "moveDown",
  MOVE_LEFT: "moveLeft",
  MOVE_RIGHT: "moveRight",
  PRIMARY_FIRE: "primaryFire",
  SECONDARY_FIRE: "secondaryFire",
  USE: "use",
  RAISE_ALTITUDE: "raiseAltitude",
  LOWER_ALTITUDE: "lowerAltitude"
}

export default class GameDemo extends Game {
  constructor(params) {
    super(params);
    
    this.menus = params.menus;
    this.renderingEngine = new FlatRenderingEngine({
      context: this.context
    });
    // TODO: create a separate render grid?
    this.grid = new Grid(400);
    this.physicsEngine = new PhysicsEngine(this.grid);

    this.gameState = {
      objects: []
    };

    this.addObject(new CircleObject({
      position: { x: 500, y: 500 }
    }));

    this.keyBindings[KEY_CODE.W] = EVENTS.MOVE_UP;
    this.keyBindings[KEY_CODE.S] = EVENTS.MOVE_DOWN;
    this.keyBindings[KEY_CODE.A] = EVENTS.MOVE_LEFT;
    this.keyBindings[KEY_CODE.D] = EVENTS.MOVE_RIGHT;
    // this.keyBindings["leftClick"] = EVENTS.PRIMARY_FIRE;
    // this.keyBindings["rightClick"] = EVENTS.SECONDARY_FIRE;
    this.activeEvents = [];

    this.addEventHandler(EVENTS.MOVE_UP, (event) => this.move(event));
    this.addEventHandler(EVENTS.MOVE_DOWN, (event) => this.move(event));
    this.addEventHandler(EVENTS.MOVE_LEFT, (event) => this.move(event));
    this.addEventHandler(EVENTS.MOVE_RIGHT, (event) => this.move(event));

    this.stateFunctions[Game.STATE.PLAYING].update = (elapsedTime) => this._update(elapsedTime);
    this.stateFunctions[Game.STATE.PLAYING].render = (elapsedTime) => this._render(elapsedTime);
  }

  move(event) {
    if (!event.release) {
      if (event.event === EVENTS.MOVE_UP) {
        this.gameState.objects[0].position.y -= 10;
      } else if (event.event === EVENTS.MOVE_DOWN) {
        this.gameState.objects[0].position.y += 10;
      } else if (event.event === EVENTS.MOVE_LEFT) {
        this.gameState.objects[0].position.x -= 10;
      } else if (event.event === EVENTS.MOVE_RIGHT) {
        this.gameState.objects[0].position.x += 10;
      }
    }
  }

  getObject(objectId) {
    return _.find(this.gameState.objects, { objectId: objectId });
  }

  addObject(object) {
    this.gameState.objects.push(object);
    if (object.collisionDimensions.length > 0) {
      this.grid.add(object);
    }
  }

  removeObject(object) {
    this.grid.remove(object);
    _.pull(this.gameState.objects, object);
  }
  
  handleCollision(collision) {}

  _render(elapsedTime) {
    this.context.save();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderingEngine.render(this.gameState.objects, elapsedTime);

    this.context.restore();
  }

  _update(elapsedTime) {
    this.physicsEngine.update(elapsedTime, this.gameState.objects, this.grid);
    this.collisions = this.physicsEngine.getCollisions(this.gameState.objects, this.grid);
    for (const collision of this.collisions) {
      this.handleCollision(collision);
    }
  }
}
