import { Sprite, Texture } from "pixi.js";
import Board from "./Board";

export class Tile extends Sprite {
  private xPos: number;
  private yPos: number;
  private board: Board;

  constructor(x: number, y: number, texture: Texture, board: Board) {
    super(texture);
    this.board = board;
    this.setPosition(x, y);
  }

  setPosition(x: number, y: number) {
    this.xPos = x;
    this.yPos = y;
    this.x = x * this.width;
    this.y = y * this.height;
  }

  canMove(x: number, y: number) {
    return this.board.getTile(x, y) === null;
  }

  getXPos() {
    return this.xPos;
  }

  getYPos() {
    return this.yPos;
  }
}
