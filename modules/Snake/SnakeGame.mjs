import KEY_CODE from "../util/keyCodes.mjs"
import Game from "../Engine/Game.mjs"
import GameObject from "../Engine/GameObject/GameObject.mjs"
import Vec3 from "../Engine/GameObject/Vec3.mjs"
import Bounds from "../Engine/GameObject/Bounds.mjs"
import FlatRenderingEngine from "../Engine/Rendering/FlatRenderingEngine.mjs"
import Food from "./Objects/Food.mjs"
import Barrier from "./Objects/Barrier.mjs"
import Border from "./Objects/Border.mjs"
import Snake from "./Objects/Snake.mjs"

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

export default class SnakeGame extends Game {
  constructor(params) {
    super(params);
    
    this.menus = params.menus;
    this.renderingEngine = new FlatRenderingEngine({
      context: this.context
    });

    this.gameState = {
      objects: []
    };

    this.gameState.snake = new Snake({
      position: this.getFreePosition()
    });

    this.gameState.objects.push(this.gameState.snake);
    this.addObject(new Border());
    this.addBarriers();
    this.addFood();

    this.keyBindings[KEY_CODE.UP] = EVENTS.MOVE_UP;
    this.keyBindings[KEY_CODE.DOWN] = EVENTS.MOVE_DOWN;
    this.keyBindings[KEY_CODE.LEFT] = EVENTS.MOVE_LEFT;
    this.keyBindings[KEY_CODE.RIGHT] = EVENTS.MOVE_RIGHT;

    this.addEventHandler(EVENTS.MOVE_UP, (event) => this.move(event));
    this.addEventHandler(EVENTS.MOVE_DOWN, (event) => this.move(event));
    this.addEventHandler(EVENTS.MOVE_LEFT, (event) => this.move(event));
    this.addEventHandler(EVENTS.MOVE_RIGHT, (event) => this.move(event));

    this.stateFunctions[Game.STATE.PLAYING].update = (elapsedTime) => this._update(elapsedTime);
    this.stateFunctions[Game.STATE.PLAYING].render = (elapsedTime) => this._render(elapsedTime);
    this.stateFunctions[Game.STATE.DONE].render = (elapsedTime) => this._render(elapsedTime);
  }

  getFreePosition() {
    let pos = {
      x: _.random(1, 48) * 20,
      y: _.random(1, 48) * 20
    };
    
    while (this.isOccupied(pos)) {
      pos = {
        x: _.random(1, 48) * 20,
        y: _.random(1, 48) * 20
      };
    }

    return pos;
  }

  addBarriers() {
    for (let i = 0; i < 15; i++) {
      this.addObject(new Barrier({
        position: this.getFreePosition()
      }));
    }
  }

  addFood() {
    this.addObject(new Food({
      position: this.getFreePosition()
    }));
  }

  isOccupied(position) {
    return this.gameState.objects.find((obj) => {
      if (obj instanceof Snake) {
        return obj.parts.some((part) => part.x === position.x && part.y === position.y);
      }
      return obj.position.x === position.x && obj.position.y === position.y;
    });
  }

  getObjectAtPosition(position, object) {
    return this.gameState.objects.find((obj) => {
      if (obj === object) return false;
      if (obj instanceof Snake) {
        return obj.parts.some((part) => part.x === position.x && part.y === position.y);
      }
      return obj.position.x === position.x && obj.position.y === position.y;
    });
  }

  move(event) {
    if (!event.release) {
      let direction = new Vec3({ x: 0, y: 0 });
      if (event.event === EVENTS.MOVE_UP) {
        direction.y = -1;
      } else if (event.event === EVENTS.MOVE_DOWN) {
        direction.y = 1;
      } else if (event.event === EVENTS.MOVE_LEFT) {
        direction.x = -1;
      } else if (event.event === EVENTS.MOVE_RIGHT) {
        direction.x = 1;
      }

      let obj = this.getObjectAtPosition(
        this.gameState.snake.position.plus(direction.times(20)));
      if (!obj || !(obj instanceof Snake)) {
        this.gameState.snake.direction = direction;
      }
    }
  }

  getObject(objectId) {
    return _.find(this.gameState.objects, { objectId: objectId });
  }

  addObject(object) {
    this.gameState.objects.push(object);
  }

  removeObject(object) {
    this.grid.remove(object);
  }
  
  handleCollision(collision) {}

  endGame() {
    this.gameState.snake.direction = new Vec3();
    super.quit();
    this.transitionState(Game.STATE.DONE);
    this.menus.transition("RETRY");
  }

  quit() {
    super.quit();
    this.menus.transition("MAIN");
  }

  _render(elapsedTime) {
    this.context.save();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "blue";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderingEngine.render(this.gameState.objects, elapsedTime);

    this.context.restore();
  }

  _update(elapsedTime) {
    for (const object of this.gameState.objects) {
      object.update(elapsedTime);
    }

    for (const part of this.gameState.snake.parts) {
      let collision = this.getObjectAtPosition(part, this.gameState.snake);
      if (collision) {
        if (collision instanceof Food) {
          this.gameState.snake.addSegments();
          _.pull(this.gameState.objects, collision);
          this.addFood();
        } else if (collision instanceof Barrier || collision instanceof Border) {
          this.endGame();
        }
      } else {
        let count = _.countBy(this.gameState.snake.parts, (p) => {
          return p.x === part.x && p.y === part.y;
        });
        if (count.true > 1) {
          this.endGame();
        }
      }
    }

    if (this.gameState.snake.position.x <= 20 || this.gameState.snake.position.y <= 20 ||
        this.gameState.snake.position.x >= 980 || this.gameState.snake.position.y >= 980) {
      this.endGame();
    }
  }
}
