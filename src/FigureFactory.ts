import { loader } from "pixi.js";

import Figure from "./Figure";
import { Tile } from "./Tile";
import Board from "./Board";

export type FigureType = "I" | "Z" | "S" | "L" | "J" | "O" | "T";

export default class FigureFactory {
  private board: Board;
  private figureTypeSettings: any;

  constructor(board: Board) {
    this.board = board;

    this.figureTypeSettings = {
      I: {
        coords: [
          [[0, 1], [1, 1], [2, 1], [3, 1]],
          [[2, 0], [2, 1], [2, 2], [2, 3]],
          [[0, 2], [1, 2], [2, 2], [3, 2]],
          [[1, 0], [1, 1], [1, 2], [1, 3]]
        ],
        texturePath: "assets/block_cyan.png"
      },
      Z: {
        coords: [
          [[1, 0], [2, 0], [0, 1], [1, 1]],
          [[1, 0], [1, 1], [2, 1], [2, 2]],
          [[1, 1], [2, 1], [0, 2], [1, 2]],
          [[0, 0], [0, 1], [1, 1], [1, 2]]
        ],
        texturePath: "assets/block_red.png"
      },
      S: {
        coords: [
          [[0, 0], [1, 0], [1, 1], [2, 1]],
          [[2, 0], [1, 1], [2, 1], [1, 2]],
          [[0, 1], [1, 1], [1, 2], [2, 2]],
          [[1, 0], [1, 1], [0, 1], [0, 2]]
        ],
        texturePath: "assets/block_green.png"
      },
      L: {
        coords: [
          [[0, 1], [1, 1], [2, 1], [2, 0]],
          [[1, 0], [1, 1], [1, 2], [2, 2]],
          [[0, 1], [1, 1], [2, 1], [0, 2]],
          [[0, 0], [1, 0], [1, 1], [1, 2]]
        ],
        texturePath: "assets/block_orange.png"
      },
      J: {
        coords: [
          [[0, 0], [0, 1], [1, 1], [2, 1]],
          [[1, 0], [1, 1], [1, 2], [2, 0]],
          [[0, 1], [1, 1], [2, 1], [2, 2]],
          [[1, 0], [1, 1], [1, 2], [0, 2]]
        ],
        texturePath: "assets/block_blue.png"
      },
      T: {
        coords: [
          [[0, 1], [1, 1], [2, 1], [1, 0]],
          [[1, 0], [1, 1], [1, 2], [2, 1]],
          [[0, 1], [1, 1], [2, 1], [1, 2]],
          [[1, 0], [1, 1], [1, 2], [0, 1]]
        ],
        texturePath: "assets/block_purple.png"
      },
      O: {
        coords: [[[0, 0], [1, 0], [0, 1], [1, 1]]],
        texturePath: "assets/block_yellow.png"
      }
    };
  }
  createFigureOfType(type: FigureType): Figure {
    const boardCenterPoint = this.board.boardWidth / 2 - 1;
    const texturePath = this.figureTypeSettings[type].texturePath;
    const origins = this.figureTypeSettings[type].coords;
    const tiles = this.figureTypeSettings[type].coords[0].map(
      (coords: number[]) => {
        return new Tile(
          boardCenterPoint + coords[0],
          coords[1],
          loader.resources[texturePath].texture,
          this.board
        );
      }
    );

    return new Figure(boardCenterPoint, 0, tiles, origins, this.board);
  }

  createRandomFigure(): Figure {
    const allTypes = Object.keys(this.figureTypeSettings);

    const randomType = <FigureType>(
      allTypes[Math.floor(Math.random() * allTypes.length)]
    );

    return this.createFigureOfType(randomType);
  }
}
