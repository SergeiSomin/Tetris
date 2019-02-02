import * as PIXI from "pixi.js";
import { SceneManager, StartScene, GameScene, EndScene } from "./Scenes";
import Config from "./config";

const renderer = PIXI.autoDetectRenderer({
  width: Config.screenWidth,
  height: Config.screenHeight
});
document.querySelector("#tetris").appendChild(renderer.view);

const ticker = new PIXI.ticker.Ticker();

PIXI.loader
  .add([
    "assets/background.png",
    "assets/block_orange.png",
    "assets/block_blue.png",
    "assets/block_cyan.png",
    "assets/block_green.png",
    "assets/block_purple.png",
    "assets/block_red.png",
    "assets/block_yellow.png"
  ])
  .load(start);

function start() {
  const sceneManager = new SceneManager();

  sceneManager.addScene("start", new StartScene(sceneManager));
  sceneManager.addScene("game", new GameScene(sceneManager));
  sceneManager.addScene("end", new EndScene(sceneManager));

  sceneManager.initScenes();

  sceneManager.changeScene("start");

  document.onkeydown = ev => sceneManager.currentScene.onKeyDown(ev);
  document.onkeyup = ev => sceneManager.currentScene.onKeyUp(ev);

  ticker.start();
  ticker.add(() => {
    sceneManager.currentScene.update(ticker.elapsedMS);
    renderer.render(sceneManager.currentScene);
  });
}
