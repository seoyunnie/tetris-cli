export class Position {
  readonly row: number;
  readonly column: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.column = col;
  }
}

export class Matrix {
  static readonly ROW_COUNT = 20;
  static readonly COLUMN_COUNT = 10;

  readonly #grid = Array.from({ length: Matrix.ROW_COUNT }, () =>
    Array.from({ length: Matrix.COLUMN_COUNT }, () => false),
  );

  get grid(): readonly (readonly boolean[])[] {
    return this.#grid;
  }

  setCell({ row, column: col }: Position): void {
    this.#grid[row]![col] = true;
  }

  isCellEmpty({ row, column: col }: Position): boolean {
    return !this.#grid[row]![col]!;
  }

  isInside({ row, column: col }: Position): boolean {
    return col >= 0 && col < Matrix.COLUMN_COUNT && row >= 0 && row < Matrix.ROW_COUNT;
  }

  isRowFull(row: number): boolean {
    for (let col = 0; col < Matrix.COLUMN_COUNT; col++) {
      if (!this.#grid[row]![col]!) {
        return false;
      }
    }

    return true;
  }

  clearRow(row: number): void {
    for (let col = 0; col < Matrix.COLUMN_COUNT; col++) {
      this.#grid[row]![col] = false;
    }
  }

  moveRowDown(row: number, rowStep: number): void {
    for (let col = 0; col < Matrix.COLUMN_COUNT; col++) {
      this.#grid[row + rowStep]![col] = this.#grid[row]![col]!;
      this.#grid[row]![col] = false;
    }
  }

  clearFullRows(): number {
    let fullRowCnt = 0;

    for (let row = Matrix.ROW_COUNT - 1; row >= 0; row--) {
      if (this.isRowFull(row)) {
        this.clearRow(row);

        fullRowCnt++;
      } else if (fullRowCnt > 0) {
        this.moveRowDown(row, fullRowCnt);
      }
    }

    return fullRowCnt;
  }

  reset(): void {
    for (let row = 0; row < Matrix.ROW_COUNT; row++) {
      for (let col = 0; col < Matrix.COLUMN_COUNT; col++) {
        this.#grid[row]![col] = false;
      }
    }
  }
}
