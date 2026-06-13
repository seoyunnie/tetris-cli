import { stdout } from "node:process";

import type { Game, GameStats } from "../core/game.ts";
import { Matrix } from "../core/matrix.ts";
import type { Tetromino } from "../core/tetromino.ts";
import { wrap } from "../utils/number.ts";

const MATRIX_BORDER_ORIGIN_X = 23;

const MATRIX_ORIGIN_X = 25;
const MATRIX_ORIGIN_Y = 1;

function printLayout(): void {
  console.clear();

  const matrixRow = `<!${" .".repeat(Matrix.COLUMN_COUNT)}!>`;

  const layoutRows = [
    matrixRow,
    `${matrixRow}   Move Left:  Left Arrow`,
    `${matrixRow}   Move Right: Right Arrow`,
    `${matrixRow}   Rotate:     Up Arrow`,
    `${matrixRow}   Soft Drop:  Down Arrow`,
    `${matrixRow}   Hard Drop:  Space`,
    matrixRow,
    `${matrixRow}   Restart:    R`,
    `${matrixRow}   Quit:       Q`,
  ];

  while (layoutRows.length < Matrix.ROW_COUNT) {
    layoutRows.push(matrixRow);
  }

  layoutRows.push("<!====================!>", String.raw`  \/\/\/\/\/\/\/\/\/\/`);

  const indent = " ".repeat(MATRIX_BORDER_ORIGIN_X);

  stdout.write(`\n${layoutRows.map((r) => `${indent}${r}`).join("\n")}\n`);
}

const MAX_STAT_VALUE = 999;

const SCORE_PER_MARK = 1000;
const SCORE_MARK_SPRITE = " ¤";

const MAX_SCORE_MARKS = 49;
const MAX_SCORE_MARKS_PER_ROW = 7;

function printStats({ fullLineCount: fullLineCnt, score }: GameStats): void {
  const cursorX = 0;
  let cursorY = 1;

  stdout.cursorTo(cursorX, cursorY++);
  stdout.write(`Full Lines: ${Math.min(fullLineCnt, MAX_STAT_VALUE)}`);

  const scoreMarkCnt = Math.min(Math.trunc(score / SCORE_PER_MARK), MAX_SCORE_MARKS);
  const scoreMarkRowCnt = Math.ceil(scoreMarkCnt / MAX_SCORE_MARKS_PER_ROW);

  const displayScore =
    scoreMarkCnt >= MAX_SCORE_MARKS && score >= MAX_STAT_VALUE ? MAX_STAT_VALUE : wrap(score, MAX_STAT_VALUE + 1);

  stdout.cursorTo(cursorX, cursorY++);
  stdout.write(`Score:      ${displayScore}`);

  for (let row = 0; row < scoreMarkRowCnt; row++) {
    stdout.cursorTo(cursorX, cursorY + row);
    stdout.write(
      SCORE_MARK_SPRITE.repeat(Math.min(scoreMarkCnt - row * MAX_SCORE_MARKS_PER_ROW, MAX_SCORE_MARKS_PER_ROW)),
    );
  }
}

const MINO_SPRITE = "[]";

function printMatrix(matrix: Matrix): void {
  for (let y = 0; y < Matrix.ROW_COUNT; y++) {
    for (let x = 0; x < Matrix.COLUMN_COUNT; x++) {
      if (matrix.isCellEmpty({ x, y })) {
        continue;
      }

      stdout.cursorTo(MATRIX_ORIGIN_X + x * MINO_SPRITE.length, MATRIX_ORIGIN_Y + y);
      stdout.write(MINO_SPRITE);
    }
  }
}

function printTetromino(tetromino: Tetromino, origX: number, origY: number): void {
  for (const { x, y } of tetromino.getMinoPositions()) {
    stdout.cursorTo(origX + x * MINO_SPRITE.length, origY + y);
    stdout.write(MINO_SPRITE);
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
