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
        coords: [[3, 0], [3, 1], [3, 2], [3, 3]],
        texturePath: "assets/block_cyan.png"
      },
      Z: {
        coords: [[3, 0], [3, 1], [2, 1], [2, 2]],
        texturePath: "assets/block_red.png"
      },
      S: {
        coords: [[2, 0], [2, 1], [3, 1], [3, 2]],
        texturePath: "assets/block_green.png"
      },
      L: {
        coords: [[2, 0], [2, 1], [2, 2], [3, 2]],
        texturePath: "assets/block_orange.png"
      },
      J: {
        coords: [[3, 0], [3, 1], [3, 2], [2, 2]],
        texturePath: "assets/block_blue.png"
      },
      T: {
        coords: [[1, 0], [2, 0], [3, 0], [2, 1]],
        texturePath: "assets/block_purple.png"
      },
      O: {
        coords: [[2, 0], [3, 0], [2, 1], [3, 1]],
        texturePath: "assets/block_yellow.png"
      }
    };
  }
  createFigureOfType(type: FigureType): Figure {
    const texturePath = this.figureTypeSettings[type].texturePath;
    const tiles = this.figureTypeSettings[type].coords.map(
      (coords: number[]) => {
        return new Tile(
          coords[0],
          coords[1],
          loader.resources[texturePath].texture,
          this.board
        );
      }
    );

    return new Figure(tiles, this.board);
  }

  createRandomFigure(): Figure {
    const allTypes = Object.keys(this.figureTypeSettings);

    const randomType = <FigureType>(
      allTypes[Math.floor(Math.random() * allTypes.length)]
    );

    return this.createFigureOfType(randomType);
  }
}
