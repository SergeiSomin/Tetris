import Figure from "./Figure";
import Board from "./Board";
import FigureFactory from "./FigureFactory";
import { Container } from "pixi.js";
import Config from "./config";

export enum FigureMovement {
  RIGHT,
  LEFT,
  ROTATE_CLOCKWISE,
  ROTATE_ANTICLOCKWISE,
  DROP_START,
  DROP_END
}

export default class Game extends Container {
  public onGameOver: Function;
  public onScoreChange: Function;
  public onDifficultyChange: Function;
  public board: Board;

  private updateSpeed: number; //Speed of moving figure in seconds;
  private dropUpdateSpeed: number;
  private currentUpdateSpeed: number;
  private timeElapsed = 0;

  private figureFactory: FigureFactory;
  private currentMovingFigure: Figure = null;

  private score: number = 0.0;

  private getDifficulty(): string {
    return (1 / this.updateSpeed).toFixed(2);
  }

  private setDifficulty(score: number) {
    this.updateSpeed -= score / 5000;
    if (this.updateSpeed < 0.1) {
      this.updateSpeed = 0.1;
    }
  }

  private calculateScore(score: number, rowsCleared: number) {
    return score + Math.pow(10, rowsCleared);
  }

  setup(width: number, height: number) {
    this.board = new Board(
      width,
      height,
      PIXI.loader.resources["assets/background.png"].texture
    ).setup(Config.boardScale, Config.boardXOffset, Config.boardYOffset);

    this.board.onFigureMerged = (rowsCleared: number) => {
      this.score = this.calculateScore(this.score, rowsCleared);
      this.setDifficulty(this.score);

      this.currentUpdateSpeed = this.updateSpeed;

      if (this.onDifficultyChange) {
        this.onDifficultyChange(this.getDifficulty());
      }

      if (this.onScoreChange) {
        this.onScoreChange(this.score);
      }

      this.startFigure();
    };

    this.board.onBoardOverflow = () => {
      if (this.onGameOver) {
        this.onGameOver(this.score);
      }
      this.stop();
    };

    this.figureFactory = new FigureFactory(this.board);

    this.addChild(this.board);
  }

  private resetGame() {
    this.board.clear();
    this.currentUpdateSpeed = Config.initialGameFrequency;
    this.updateSpeed = Config.initialGameFrequency;
    this.dropUpdateSpeed = Config.initialDropFrequency;
    this.score = 0;

    if (this.onDifficultyChange) {
      this.onDifficultyChange(this.getDifficulty());
    }

    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }

  moveFigure(figureMovement: FigureMovement) {
    if (!this.currentMovingFigure) {
      return;
    }

    switch (figureMovement) {
      case FigureMovement.RIGHT:
        this.currentMovingFigure.move(1, 0);
        break;
      case FigureMovement.LEFT:
        this.currentMovingFigure.move(-1, 0);
        break;
      case FigureMovement.DROP_START:
        this.currentUpdateSpeed = this.dropUpdateSpeed;
        this.timeElapsed = 0;
        break;
      case FigureMovement.DROP_END:
        this.currentUpdateSpeed = this.updateSpeed;
        break;
      case FigureMovement.ROTATE_CLOCKWISE:
        this.currentMovingFigure.rotate(true);
        break;
      case FigureMovement.ROTATE_ANTICLOCKWISE:
        this.currentMovingFigure.rotate(false);
        break;
    }
  }

  startFigure() {
    const figure = this.figureFactory.createRandomFigure();
    this.currentMovingFigure = figure;
    this.board.startMovingFigure(figure);
  }

  start() {
    this.resetGame();
    this.startFigure();
  }

  stop() {
    this.timeElapsed = 0;
  }

  update(elapsedMS: number) {
    this.timeElapsed += elapsedMS;
    if (this.timeElapsed > this.currentUpdateSpeed * 1000) {
      this.board.step();
      this.timeElapsed -= this.currentUpdateSpeed * 1000;
    }
  }
}
