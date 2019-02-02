import { Tile } from "./Tile";
import Board from "./Board";

export default class Figure {
  public tiles: Tile[];
  private board: Board;

  constructor(tiles: Tile[], board: Board) {
    this.tiles = tiles;
    this.board = board;
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
    }
  }

  moveDown() {
    if (
      this.tiles.every(tile => tile.canMove(tile.getXPos(), tile.getYPos() + 1))
    ) {
      this.tiles.forEach(tile => {
        tile.setPosition(tile.getXPos(), tile.getYPos() + 1);
      });
    } else {
      this.board.mergeFigure(this);
    }
  }

  getOrigin() {
    let originX = Math.round(
      this.tiles.reduce((acc, tile) => {
        return acc + tile.getXPos();
      }, 0) / this.tiles.length
    );

    let originY = Math.round(
      this.tiles.reduce((acc, tile) => {
        return acc + tile.getYPos();
      }, 0) / this.tiles.length
    );

    return {
      x: originX,
      y: originY
    };
  }
  rotate(clockwise: boolean) {
    const origin = this.getOrigin();
    const newCoords = this.tiles.map(tile => {
      const translationCoordinate = {
        x: tile.getXPos() - origin.x,
        y: (tile.getYPos() - origin.y) * (clockwise ? -1 : 1)
      };

      const rotatedCoordinate = {
        x: translationCoordinate.x,
        y: translationCoordinate.y
      };

      rotatedCoordinate.x = Math.round(
        translationCoordinate.x * Math.cos(Math.PI / 2) -
          translationCoordinate.y * Math.sin(Math.PI / 2)
      );
      rotatedCoordinate.y = Math.round(
        translationCoordinate.x * Math.sin(Math.PI / 2) +
          translationCoordinate.y * Math.cos(Math.PI / 2)
      );

      rotatedCoordinate.y *= clockwise ? -1 : 1;

      rotatedCoordinate.x += origin.x;
      rotatedCoordinate.y += origin.y;

      rotatedCoordinate.x = Math.floor(rotatedCoordinate.x);
      rotatedCoordinate.y = Math.floor(rotatedCoordinate.y);

      return rotatedCoordinate;
    });

    if (
      this.tiles.every((tile, index) => {
        return tile.canMove(newCoords[index].x, newCoords[index].y);
      })
    ) {
      this.tiles.forEach((tile, index) => {
        return tile.setPosition(newCoords[index].x, newCoords[index].y);
      });
    }
  }
}
