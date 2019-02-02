import { Container, Text, extras, loader } from "pixi.js";
import { IScene, SceneManager } from "./";
import { titleText, defaultText } from "../textStyles";
import Config from "../config";

export default class StartScene extends Container implements IScene {
  private sceneManager: SceneManager;

  private background: extras.TilingSprite;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  private createBackground(screenWidth: number, screenHeight: number) {
    this.background = new extras.TilingSprite(
      loader.resources["assets/background.png"].texture
    );
    this.background.width = screenWidth;
    this.background.height = screenHeight;

    this.addChild(this.background);
  }

  onInit(): void {
    this.createBackground(Config.screenWidth, Config.screenHeight);

    const text = new Text("Press 'enter' to start game.", defaultText);
    text.x = 10;
    text.y = 45;
    this.addChild(text);

    const title = new Text("TETRIS", titleText);
    title.x = 10;
    title.y = 10;
    this.addChild(title);
  }
  onEnter(): void {}
  onLeave(): void {}
  update(elapsedMS: number): void {
    this.background.tilePosition.x += elapsedMS;
  }
  onKeyDown(ev: KeyboardEvent): void {
    switch (ev.code) {
      case "Enter":
        this.sceneManager.changeScene("game");
        break;
    }
  }
  onKeyUp(ev: KeyboardEvent): void {}
}
