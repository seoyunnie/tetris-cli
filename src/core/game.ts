import type { Tetromino } from "./tetromino.ts";

import { popRandom } from "../utils/random-utils.ts";
import { Matrix } from "./matrix.ts";
import { getNewInstances } from "./tetrominoes.ts";

// oxlint-disable-next-line no-magic-numbers
const LINE_CLEAR_POINTS = [0, 100, 200, 500, 800] as const;
const MOVE_DOWN_POINTS = 1;
const HARD_DROP_POINTS = 2;

export interface GameStats {
  fullLineCount: number;
  score: number;
}

export class Game {
  readonly matrix = new Matrix();

  #currentTetromino: Tetromino;
  #nextTetromino: Tetromino;
  #remainingTetrominoes: Tetromino[];

  #fullLineCount = 0;
  #score = 0;

  #isRunning = true;
  isOver = false;

  constructor() {
    this.#remainingTetrominoes = getNewInstances();
    this.#currentTetromino = this.#getRandomBlock();
    this.#nextTetromino = this.#getRandomBlock();
  }

  get currentTetromino(): Tetromino {
    return this.#currentTetromino;
  }

  get nextTetromino(): Tetromino {
    return this.#nextTetromino;
  }

  get isRunning(): boolean {
    return this.#isRunning;
  }

  getStats(): GameStats {
    return { fullLineCount: this.#fullLineCount, score: this.#score };
  }

  #getRandomBlock(): Tetromino {
    if (this.#remainingTetrominoes.length === 0) {
      this.#remainingTetrominoes = getNewInstances();
    }

    return popRandom(this.#remainingTetrominoes);
  }

  updateScore(clearedRowCnt: number, moveDownPoints: number): void {
    const clearedRowPoints = LINE_CLEAR_POINTS[Math.min(clearedRowCnt, LINE_CLEAR_POINTS.length - 1)]!;
    this.#score += clearedRowPoints + moveDownPoints;
  }

  isInsideGrid(): boolean {
    return this.#currentTetromino.getMinoPositions().every((m) => this.matrix.isInside(m));
  }

  canPlaceTetromino(): boolean {
    return this.#currentTetromino.getMinoPositions().every((m) => this.matrix.isCellEmpty(m));
  }

  lockTetromino(): void {
    for (const pos of this.#currentTetromino.getMinoPositions()) {
      this.matrix.setCell(pos);
    }

    this.#currentTetromino = this.#nextTetromino;
    this.#nextTetromino = this.#getRandomBlock();

    const clearedRowCnt = this.matrix.clearFullRows();

    this.#fullLineCount += clearedRowCnt;

    this.updateScore(clearedRowCnt, 0);

    if (!this.canPlaceTetromino()) {
      this.isOver = true;
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
    this.#currentTetromino = this.#getRandomBlock();
    this.#nextTetromino = this.#getRandomBlock();
  }

  stop(): void {
    this.#isRunning = false;
  }
}
