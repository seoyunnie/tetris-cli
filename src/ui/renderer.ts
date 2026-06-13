import type { Game, GameStats } from "../core/game.ts";
import { Matrix } from "../core/matrix.ts";
import type { Tetromino } from "../core/tetromino.ts";
import { wrap } from "../utils/number.ts";

const MATRIX_BORDER_ORIGIN_X = 23;

const MATRIX_ORIGIN_X = 25;
const MATRIX_ORIGIN_Y = 1;

function printLayout(): void {
  console.clear();

  const spaceOffset = " ".repeat(MATRIX_BORDER_ORIGIN_X);
  const matrixBorderedRow = `<!${" .".repeat(Matrix.COLUMN_COUNT)}!>`;

  const matrixRows = [
    "",
    "Move Left:  Left Arrow",
    "Move Right: Right Arrow",
    "Rotate:     Up Arrow",
    "Soft Drop:  Down Arrow",
    "Hard Drop:  Space",
    "",
    "Restart: R",
    "Quit:    Q",
  ].map((r) => (r === "" ? matrixBorderedRow : `${matrixBorderedRow}   ${r}`));

  matrixRows.push(
    ...Array.from({ length: Matrix.ROW_COUNT - matrixRows.length }, () => matrixBorderedRow),
    "<!====================!>",
    String.raw`  \/\/\/\/\/\/\/\/\/\/`,
  );

  process.stdout.write(`\n${matrixRows.map((r) => `${spaceOffset}${r}`).join("\n")}\n`);
}

const MAX_STAT_VALUE = 999;

const SCORE_PER_MARK = 1000;
const SCORE_MARK_SPRITE = " ¤";

const MAX_SCORE_MARKS = 49;
const MAX_SCORE_MARKS_PER_ROW = 7;

function printStats({ fullLineCount: fullLineCnt, score }: GameStats): void {
  const cursorX = 0;
  let cursorY = 1;

  process.stdout.cursorTo(cursorX, cursorY++);
  process.stdout.write(`Full Lines: ${Math.min(fullLineCnt, MAX_STAT_VALUE)}`);

  const scoreMarkCnt = Math.min(Math.trunc(score / SCORE_PER_MARK), MAX_SCORE_MARKS);
  const scoreMarkRowCnt = Math.ceil(scoreMarkCnt / MAX_SCORE_MARKS_PER_ROW);

  const displayScore =
    scoreMarkCnt >= MAX_SCORE_MARKS && score >= MAX_STAT_VALUE ? MAX_STAT_VALUE : wrap(score, MAX_STAT_VALUE + 1);

  process.stdout.cursorTo(cursorX, cursorY++);
  process.stdout.write(`Score:      ${displayScore}`);

  for (let row = 0; row < scoreMarkRowCnt; row++) {
    process.stdout.cursorTo(cursorX, cursorY + row);
    process.stdout.write(
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

      process.stdout.cursorTo(MATRIX_ORIGIN_X + x * MINO_SPRITE.length, MATRIX_ORIGIN_Y + y);
      process.stdout.write(MINO_SPRITE);
    }
  }
}

function printTetromino(tetromino: Tetromino, origX: number, origY: number): void {
  for (const { x, y } of tetromino.getMinoPositions()) {
    process.stdout.cursorTo(origX + x * MINO_SPRITE.length, origY + y);
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
