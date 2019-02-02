import { Tile } from "./Tile";
import Board from "./Board";

export default class Figure {
  public tiles: Tile[];
  private board: Board;
  private origins: any[];

  private x: number;
  private y: number;

  private rotationNumber = 0;

  constructor(
    x: number,
    y: number,
    tiles: Tile[],
    origins: any[],
    board: Board
  ) {
    this.tiles = tiles;
    this.board = board;
    this.origins = origins;
    this.x = x;
    this.y = y;
  }

  move(deltaX: number, deltaY: number) {
    if (
      this.tiles.every(tile =>
        tile.canMove(tile.getXPos() + deltaX, tile.getYPos() + deltaY)
      )
    ) {
      this.tiles.forEach(tile => {
        tile.setPosition(tile.getXPos() + deltaX, tile.getYPos() + deltaY);
      });
      this.x += deltaX;
      this.y += deltaY;
    }
  }

  moveDown() {
    if (
      this.tiles.every(tile => tile.canMove(tile.getXPos(), tile.getYPos() + 1))
    ) {
      this.tiles.forEach(tile => {
        tile.setPosition(tile.getXPos(), tile.getYPos() + 1);
      });
      this.y++;
    } else {
      this.board.mergeFigure(this);
    }
  }

  rotate(clockwise: boolean) {
    let rotationNumber =
      this.rotationNumber >= 0
        ? this.rotationNumber % this.origins.length
        : this.origins.length - 1 + (this.rotationNumber % this.origins.length);

    const newCoords = this.origins[rotationNumber];

    if (
      this.tiles.every((tile, index) => {
        return tile.canMove(
          this.x + newCoords[index][0],
          this.y + newCoords[index][1]
        );
      })
    ) {
      this.rotationNumber += clockwise ? -1 : 1;
      this.tiles.forEach((tile, index) => {
        return tile.setPosition(
          this.x + newCoords[index][0],
          this.y + newCoords[index][1]
        );
      });
    }
  }
}
