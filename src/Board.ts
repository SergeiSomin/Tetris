import { Tile } from "./Tile";
import { Container, Texture, Point } from "pixi.js";
import Figure from "./Figure";

export default class Board extends Container {
  public onFigureMerged: Function;
  public onBoardOverflow: Function;

  public boardWidth: number;
  public boardHeight: number;

  private backgroundTileTexture: Texture;
  private movingFigure: Figure;
  private tiles: Tile[][];

  constructor(
    boardWidth: number,
    boardHeight: number,
    backgroundTileTexture: Texture
  ) {
    super();
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.backgroundTileTexture = backgroundTileTexture;
  }

  private setEmptyBoard() {
    this.tiles = [];
    for (let y = 0; y < this.boardHeight; y++) {
      const arr: Tile[] = [];
      for (let x = 0; x < this.boardWidth; x++) {
        arr[x] = null;
      }
      this.tiles.push(arr);
    }
  }

  private setBackgroundTiles() {
    const backgroundTiles: PIXI.DisplayObject[] = [];

    for (let y = 0; y < this.boardHeight; y++) {
      for (let x = 0; x < this.boardWidth; x++) {
        const backgroundTile = new Tile(x, y, this.backgroundTileTexture, this);

        backgroundTiles.push(backgroundTile);
      }
    }

    const background = new Container();
    background.addChild(...backgroundTiles);

    this.addChild(background);
  }

  private createNewRow(): Tile[] {
    const newRow = [];
    for (let k = 0; k < this.boardWidth; k++) {
      newRow.push(null);
    }
    return newRow;
  }

  private clearRow(rowIndex: number) {
    this.tiles[rowIndex].forEach(tile => {
      this.removeChild(tile);
    });
    this.tiles.splice(rowIndex, 1);
  }

  mergeFigure(figure: Figure) {
    if (
      !figure.tiles.every(tile => tile.canMove(tile.getXPos(), tile.getYPos()))
    ) {
      if (this.onBoardOverflow) {
        this.onBoardOverflow();
        return;
      }
    }

    figure.tiles.forEach(tile => this.setTile(tile));
    if (this.onFigureMerged) {
      this.onFigureMerged(this.clearFullRows());
    }
  }

  startMovingFigure(figure: Figure) {
    if (
      !figure.tiles.every(tile => tile.canMove(tile.getXPos(), tile.getYPos()))
    ) {
      if (this.onBoardOverflow) {
        this.onBoardOverflow();
        return;
      }
    }
    this.movingFigure = figure;
    this.addChild(...figure.tiles);
  }

  setTile(tile: Tile) {
    this.tiles[tile.getYPos()][tile.getXPos()] = tile;
    this.addChild(tile);
  }

  removeTile(tile: Tile) {
    this.tiles[tile.getXPos()][tile.getYPos()] = null;
    this.removeChild(tile);
  }

  getTile(x: number, y: number): Tile | boolean {
    if (x >= this.boardWidth || x < 0 || y >= this.boardHeight || y < 0) {
      return false;
    }
    return this.tiles[y][x];
  }

  setup(scale: number, xOffset: number, yOffset: number) {
    this.setEmptyBoard();
    this.setBackgroundTiles();
    this.scale = new Point(scale, scale);
    this.x = xOffset;
    this.y = yOffset;
    return this;
  }

  clear() {
    this.setEmptyBoard();
    this.setBackgroundTiles();
  }

  clearFullRows(): number {
    let clearedRowsCount = 0;
    for (let i = this.boardHeight - 1; i >= 0; ) {
      if (this.tiles[i].every(tile => tile != null)) {
        this.clearRow(i);
        clearedRowsCount++;
        this.tiles.unshift(this.createNewRow());

        for (let j = i; j >= 0; j--) {
          this.tiles[j].forEach(tile => {
            if (tile) {
              tile.setPosition(tile.getXPos(), tile.getYPos() + 1);
            }
          });
        }
      } else {
        i--;
      }
    }

    return clearedRowsCount;
  }

  step() {
    if (this.movingFigure) {
      this.movingFigure.moveDown();
    }
  }
}
