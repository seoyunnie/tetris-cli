import type { Position } from "./matrix.ts";

type MinoPositions = [Position, Position, Position, Position];

export abstract class Tetromino {
  readonly minoPositionsByRotation: MinoPositions[];

  #xOffset = 0;
  #yOffset = 0;

  readonly #rotationCount: number;
  #currentRotationIndex = 0;

  constructor(minoPositionsByRotation: MinoPositions[]) {
    this.minoPositionsByRotation = minoPositionsByRotation;

    this.#rotationCount = minoPositionsByRotation.length;
  }

  getMinoPositions(): readonly Position[] {
    return this.minoPositionsByRotation[this.#currentRotationIndex]!.map((pos) => ({
      x: pos.x + this.#xOffset,
      y: pos.y + this.#yOffset,
    }));
  }

  move(deltaX: number, deltaY: number): void {
    this.#xOffset += deltaX;
    this.#yOffset += deltaY;
  }

  moveLeft(): void {
    this.move(-1, 0);
  }

  moveRight(): void {
    this.move(1, 0);
  }

  moveUp(): void {
    this.move(0, -1);
  }

  moveDown(): void {
    this.move(0, 1);
  }

  rotate(): void {
    this.#currentRotationIndex = (this.#currentRotationIndex + 1) % this.#rotationCount;
  }

  undoRotate(): void {
    this.#currentRotationIndex =
      this.#currentRotationIndex === 0 ? this.#rotationCount - 1 : this.#currentRotationIndex - 1;
  }
}
