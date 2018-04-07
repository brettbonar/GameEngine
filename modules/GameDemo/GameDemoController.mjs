import { registerController, GameController } from "../Engine/GameController.mjs"
import GameDemoUI from "../GameDemo/GameDemoUI.mjs"
import ImageCache from "../Engine/Rendering/ImageCache.mjs"
import GameDemo from "./GameDemo.mjs"
//import { initialize } from "../Engine/Rendering/Scratch.mjs"

export default class GameDemoController extends GameController {
  constructor(element, params) {
    super(element, params, {
      menus: new GameDemoUI()
    });

    this.game = new GameDemo({
      canvas: document.getElementById("canvas-main")
    });
  }

  getHighScores() {
    // Get top 5
    return this.highScores;
  }

  newGame() {
    this.menus.hideAll();
    this.start();
  }
}

registerController("GameDemoController", GameDemoController);
