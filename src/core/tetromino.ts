import { Position } from "./matrix.ts";

export type MinoPositions = Record<number, [Position, Position, Position, Position]>;

export abstract class Tetromino {
  readonly minoPositions: MinoPositions;
  readonly #minoCount: number;

  #columnOffset = 0;
  #rowOffset = 0;

  #rotationState: keyof MinoPositions = 0;

  constructor(minoPositions: MinoPositions) {
    this.minoPositions = minoPositions;
    this.#minoCount = Object.getOwnPropertyNames(this.minoPositions).length;
  }

  getMinoPositions(): readonly Position[] {
    return (
      this.minoPositions[this.#rotationState]?.map(
        (m) => new Position(m.row + this.#rowOffset, m.column + this.#columnOffset),
      ) ?? []
    );
  }

  move(colStep: number, rowStep: number): void {
    this.#columnOffset += colStep;
    this.#rowOffset += rowStep;
  }

  rotate(): void {
    this.#rotationState = (this.#rotationState + 1) % this.#minoCount;
  }

  undoRotate(): void {
    this.#rotationState = this.#rotationState === 0 ? this.#minoCount - 1 : this.#rotationState - 1;
  }
}
