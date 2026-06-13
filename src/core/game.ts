import { popRandom } from "../utils/array.ts";
import { Matrix } from "./matrix.ts";
import type { Tetromino } from "./tetromino.ts";
import { getNewInstances } from "./tetrominoes.ts";

// oxlint-disable-next-line no-magic-numbers
const LINE_CLEAR_POINTS = [0, 100, 200, 500, 800] as const;
const MAX_LINE_CLEAR_COUNT = 4;

const MOVE_DOWN_POINTS = 1;
const HARD_DROP_POINTS = 2;

export interface GameStats {
  fullLineCount: number;
  score: number;
}

export class Game {
  readonly matrix = new Matrix();

  #fullLineCount = 0;
  #score = 0;

  #currentTetromino: Tetromino;
  #nextTetromino: Tetromino;
  #remainingTetrominoes: Tetromino[];

  #isOver = false;
  #hasQuit = false;

  constructor() {
    this.#remainingTetrominoes = getNewInstances();
    this.#currentTetromino = this.#getRandomTetromino();
    this.#nextTetromino = this.#getRandomTetromino();
  }

  getStats(): GameStats {
    return { fullLineCount: this.#fullLineCount, score: this.#score };
  }

  get currentTetromino(): Tetromino {
    return this.#currentTetromino;
  }

  get nextTetromino(): Tetromino {
    return this.#nextTetromino;
  }

  get isOver(): boolean {
    return this.#isOver;
  }

  get hasQuit(): boolean {
    return this.#hasQuit;
  }

  #getRandomTetromino(): Tetromino {
    if (this.#remainingTetrominoes.length === 0) {
      this.#remainingTetrominoes = getNewInstances();
    }

    return popRandom(this.#remainingTetrominoes)!;
  }

  updateScore(clearedLineCnt: number, moveDownPoints: number): void {
    const clearedLinePoints = LINE_CLEAR_POINTS[Math.min(clearedLineCnt, MAX_LINE_CLEAR_COUNT)]!;

    this.#score += clearedLinePoints + moveDownPoints;
  }

  isInsideGrid(): boolean {
    return this.#currentTetromino.getMinoPositions().every((p) => this.matrix.isInside(p));
  }

  canPlaceTetromino(): boolean {
    return this.#currentTetromino.getMinoPositions().every((p) => this.matrix.isCellEmpty(p));
  }

  lockTetromino(): void {
    for (const pos of this.#currentTetromino.getMinoPositions()) {
      this.matrix.fillCell(pos);
    }

    const clearedLineCnt = this.matrix.clearFullRows();
    this.#fullLineCount += clearedLineCnt;

    this.updateScore(clearedLineCnt, 0);

    this.#currentTetromino = this.#nextTetromino;
    this.#nextTetromino = this.#getRandomTetromino();

    if (!this.canPlaceTetromino()) {
      this.#isOver = true;
    }
  }

  moveLeft(): void {
    this.#currentTetromino.move(-1, 0);

    if (!this.isInsideGrid() || !this.canPlaceTetromino()) {
      this.#currentTetromino.move(1, 0);
    }
  }

  moveRight(): void {
    this.#currentTetromino.move(1, 0);

    if (!this.isInsideGrid() || !this.canPlaceTetromino()) {
      this.#currentTetromino.move(-1, 0);
    }
  }

  moveDown(awardScore = false): void {
    this.#currentTetromino.move(0, 1);

    if (!this.isInsideGrid() || !this.canPlaceTetromino()) {
      this.#currentTetromino.move(0, -1);

      this.lockTetromino();

      return;
    }

    if (awardScore) {
      this.updateScore(0, MOVE_DOWN_POINTS);
    }
  }

  hardDrop(): void {
    while (true) {
      this.#currentTetromino.move(0, 1);

      if (!this.isInsideGrid() || !this.canPlaceTetromino()) {
        this.#currentTetromino.move(0, -1);

        this.lockTetromino();

        break;
      }

      this.updateScore(0, HARD_DROP_POINTS);
    }
  }

  rotate(): void {
    this.#currentTetromino.rotate();

    if (!this.isInsideGrid() || !this.canPlaceTetromino()) {
      this.#currentTetromino.undoRotate();
    }
  }

  reset(): void {
    this.matrix.reset();

    this.#fullLineCount = 0;
    this.#score = 0;

    this.#remainingTetrominoes = getNewInstances();
    this.#currentTetromino = this.#getRandomTetromino();
    this.#nextTetromino = this.#getRandomTetromino();

    this.#isOver = false;
  }

  quit(): void {
    this.#hasQuit = true;
  }
}
