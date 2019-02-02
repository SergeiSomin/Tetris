import { Container, extras, loader, Text } from "pixi.js";
import { IScene } from ".";
import SceneManager from "./SceneManager";
import Config from "../config";
import TemplatedText from "../TemplatedText";
import { titleText, defaultText } from "../textStyles";

export default class EndScene extends Container implements IScene {
  private sceneManager: SceneManager;
  private background: extras.TilingSprite;

  private score: TemplatedText;
  private text: Text;

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

    this.score = new TemplatedText("Your score: {{score}}", "", titleText);
    this.score.y = 10;
    this.score.x = 10;
    this.addChild(this.score);

    this.text = new Text("Press 'enter' to play again.", defaultText);
    this.text.y = 45;
    this.text.x = 10;
    this.addChild(this.text);
  }
  onEnter(params: any): void {
    this.score.setValues({
      score: params.score
    });
  }
  onLeave(): void {}
  update(): void {}
  onKeyDown(ev: KeyboardEvent): void {
    switch (ev.code) {
      case "Enter":
        this.sceneManager.changeScene("start");
        break;
    }
  }
  onKeyUp(ev: KeyboardEvent): void {}
}
