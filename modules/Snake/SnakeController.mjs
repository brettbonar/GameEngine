import { registerController, GameController } from "../Engine/GameController.mjs"
import Game from "../Engine/Game.mjs"
import SnakeUI from "../Snake/SnakeUI.mjs"
import ImageCache from "../Engine/Rendering/ImageCache.mjs"
import SnakeGame from "./SnakeGame.mjs"
//import { initialize } from "../Engine/Rendering/Scratch.mjs"

const HIGH_SCORE_STORAGE = "snake_highScores";

export default class SnakeController extends GameController {
  constructor(element, params) {
    super(element, params, {
      menus: new SnakeUI()
    });
    this.highScores = localStorage.getItem(HIGH_SCORE_STORAGE);
    if (this.highScores) {
      this.highScores = JSON.parse(this.highScores);
    } else {
      this.highScores = [];
    }
  }

  getHighScores() {
    return this.highScores;
  }

  saveScore(game) {
    this.highScores.push(game.gameState.snake.parts.length);
    localStorage.setItem(HIGH_SCORE_STORAGE, JSON.stringify(this.highScores));
  }

  newGame() {
    this.game = new SnakeGame({
      canvas: document.getElementById("canvas-main"),
      menus: this.menus
    });
    this.game.onStateChange(Game.STATE.DONE, (game) => this.saveScore(game));
    this.game.onStateChange(Game.STATE.GAME_OVER, (game) => this.saveScore(game));
    document.getElementById("canvas-main").style.display = "block";
    this.menus.hideAll();
    this.start();
  }

  returnToMain() {
    document.getElementById("canvas-main").style.display = "none";
    this.game = null;
    this.done = true;
  }
}

registerController("SnakeController", SnakeController);
