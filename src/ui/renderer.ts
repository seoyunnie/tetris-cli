import type { Game, GameStats } from "../core/game.ts";
import type { Tetromino } from "../core/tetromino.ts";

import { Matrix } from "../core/matrix.ts";
import { wrapByDigits } from "../utils/number-utils.ts";

const MATRIX_BORDER_ORIGIN_X = 23;

const MATRIX_ORIGIN_X = 25;
const MATRIX_ORIGIN_Y = 1;

function printLayout(): void {
  console.clear();

  process.stdout.write("\n");

  const spaceOffset = " ".repeat(MATRIX_BORDER_ORIGIN_X);
  const matrixBorderedRow = `<!${" .".repeat(Matrix.COLUMN_COUNT)}!>`;

  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Move Left: Left Arrow\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Move Right: Right Arrow\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Rotate: Up Arrow\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Soft Drop: Down Arrow\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Hard Drop: Space\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Restart: R\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}   Quit: Q\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}${matrixBorderedRow}\n`);
  process.stdout.write(`${spaceOffset}<!====================!>\n`);
  process.stdout.write(`${spaceOffset}  \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\n`);
}

const MAX_FULL_LINE_COUNT_DIGITS = 10;
const MAX_SCORE_DIGITS = 15;

function printStats({ fullLineCount: fullLineCnt, score }: GameStats): void {
  const cursorX = 0;
  let cursorY = 1;

  process.stdout.cursorTo(cursorX, cursorY++);
  process.stdout.write(`Full Lines: ${wrapByDigits(fullLineCnt, MAX_FULL_LINE_COUNT_DIGITS)}`);

  process.stdout.cursorTo(cursorX, cursorY);
  process.stdout.write(`Score: ${wrapByDigits(score, MAX_SCORE_DIGITS)}`);
}

const MINO_SPRITE = "[]";
const MINO_WIDTH = MINO_SPRITE.length;

function printMatrix(matrix: Matrix): void {
  for (let row = 0; row < Matrix.ROW_COUNT; row++) {
    for (let col = 0; col < Matrix.COLUMN_COUNT; col++) {
      if (matrix.grid[row]![col]!) {
        process.stdout.cursorTo(MATRIX_ORIGIN_X + col * MINO_WIDTH, MATRIX_ORIGIN_Y + row);
        process.stdout.write(MINO_SPRITE);
      }
    }
  }
}

function printTetromino(tetromino: Tetromino, originX: number, originY: number): void {
  for (const { row, column: col } of tetromino.getMinoPositions()) {
    process.stdout.cursorTo(originX + col * MINO_WIDTH, originY + row);
    process.stdout.write(MINO_SPRITE);
  }
}

const TETROMINO_PREVIEW_OFFSET_X = -16;
const TETROMINO_PREVIEW_ORIGIN_X = MATRIX_BORDER_ORIGIN_X + TETROMINO_PREVIEW_OFFSET_X;
const TETROMINO_PREVIEW_ORIGIN_Y = 12;

export function render(game: Game): void {
  printLayout();

  printStats(game.getStats());
  printMatrix(game.matrix);

  if (!game.isOver) {
    printTetromino(game.currentTetromino, MATRIX_ORIGIN_X, MATRIX_ORIGIN_Y);
    printTetromino(game.nextTetromino, TETROMINO_PREVIEW_ORIGIN_X, TETROMINO_PREVIEW_ORIGIN_Y);
  }
}
