import { Container } from "pixi.js";
import { IScene, SceneManager } from ".";
import Game, { FigureMovement } from "../Game";
import Config from "../config";
import TemplatedText from "../TemplatedText";
import { defaultText } from "../textStyles";

export default class GameScene extends Container implements IScene {
  private sceneManager: SceneManager;

  private game: Game;

  private scoreText: TemplatedText;
  private difficultyText: TemplatedText;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  private onGameOver(score: number) {
    this.sceneManager.changeScene("end", { score });
  }
  onInit(): void {
    this.game = new Game();
    this.game.setup(Config.boardWidth, Config.boardHeight);
    this.game.onGameOver = (score: number) => this.onGameOver(score);
    this.addChild(this.game);

    this.scoreText = new TemplatedText(
      "Score: {{score}}",
      "Score: 0",
      defaultText
    );

    this.difficultyText = new TemplatedText(
      "Difficulty: {{difficulty}}",
      "Difficulty: 0",
      defaultText
    );

    this.scoreText.x = this.game.board.x + this.game.board.width + 20;
    this.scoreText.y = this.game.board.y + 10;

    this.difficultyText.x = this.game.board.x + this.game.board.width + 20;
    this.difficultyText.y = this.game.board.y + 30;

    this.game.onScoreChange = (score: number) =>
      this.scoreText.setValues({ score });

    this.game.onDifficultyChange = (difficulty: number) =>
      this.difficultyText.setValues({
        difficulty
      });

    this.addChild(this.scoreText);
    this.addChild(this.difficultyText);
  }
  onEnter(): void {
    this.game.start();
  }
  onLeave(): void {
    this.game.stop();
  }
  update(elapsedMS: number): void {
    this.game.update(elapsedMS);
  }
  onKeyDown(ev: KeyboardEvent): void {
    switch (ev.code) {
      case "ArrowRight":
      case "KeyD":
        this.game.moveFigure(FigureMovement.RIGHT);
        break;

      case "ArrowLeft":
      case "KeyA":
        this.game.moveFigure(FigureMovement.LEFT);
        break;

      case "ArrowDown":
      case "KeyS":
        if (!ev.repeat) {
          this.game.moveFigure(FigureMovement.DROP_START);
        }
        break;

      case "ArrowUp":
      case "KeyW":
      case "KeyX":
        this.game.moveFigure(FigureMovement.ROTATE_CLOCKWISE);
        break;

      case "KeyZ":
        this.game.moveFigure(FigureMovement.ROTATE_ANTICLOCKWISE);
        break;
    }
  }
  onKeyUp(ev: KeyboardEvent): void {
    switch (ev.code) {
      case "ArrowDown":
      case "KeyS":
        this.game.moveFigure(FigureMovement.DROP_END);
        break;
    }
  }
}
