export interface Position {
  readonly x: number;
  readonly y: number;
}

export class Matrix {
  static readonly COLUMN_COUNT = 10;
  static readonly ROW_COUNT = 20;

  static readonly #FULL_ROW = (1 << Matrix.COLUMN_COUNT) - 1;

  readonly #grid = new Uint16Array(Matrix.ROW_COUNT);

  constructor(initialState?: readonly (readonly boolean[])[]) {
    if (!initialState) {
      return;
    }

    if (initialState.length > Matrix.ROW_COUNT) {
      throw new RangeError(`initialState must have at most ${Matrix.ROW_COUNT} rows, got ${initialState.length}`);
    }

    for (let row = 0; row < initialState.length; row++) {
      const initialRow = initialState[row]!;

      if (initialRow.length > Matrix.COLUMN_COUNT) {
        throw new RangeError(
          `initialState[${row}] must have at most ${Matrix.COLUMN_COUNT} columns, got ${initialRow.length}`,
        );
      }

      for (let col = 0; col < initialRow.length; col++) {
        if (initialRow[col] === true) {
          this.fillCell({ x: col, y: row });
        }
      }
    }
  }

  #isValidColumn(col: number): boolean {
    return Number.isInteger(col) && col >= 0 && col < Matrix.COLUMN_COUNT;
  }

  #isValidRow(row: number): boolean {
    return Number.isInteger(row) && row >= 0 && row < Matrix.ROW_COUNT;
  }

  isInside({ x: col, y: row }: Readonly<Position>): boolean {
    return this.#isValidColumn(col) && this.#isValidRow(row);
  }

  #assertValidCell({ x: col, y: row }: Readonly<Position>): void {
    if (!this.#isValidColumn(col)) {
      throw new RangeError(`pos.x must be an integer between 0 and ${Matrix.COLUMN_COUNT - 1}, got ${col}`);
    }

    if (!this.#isValidRow(row)) {
      throw new RangeError(`pos.y must be an integer between 0 and ${Matrix.ROW_COUNT - 1}, got ${row}`);
    }
  }

  fillCell(pos: Readonly<Position>): void {
    this.#assertValidCell(pos);

    this.#grid[pos.y]! |= 1 << pos.x;
  }

  isCellEmpty(pos: Readonly<Position>): boolean {
    this.#assertValidCell(pos);

    return (this.#grid[pos.y]! & (1 << pos.x)) === 0;
  }

  #assertValidRow(row: number): void {
    if (!this.#isValidRow(row)) {
      throw new RangeError(`row must be an integer between 0 and ${Matrix.ROW_COUNT - 1}, got ${row}`);
    }
  }

  clearRow(row: number): void {
    this.#assertValidRow(row);

    this.#grid[row] = 0;
  }

  moveRowDown(row: number, rowStep: number): void {
    this.#assertValidRow(row);

    this.#grid[row + rowStep] = this.#grid[row]!;

    this.clearRow(row);
  }

  isRowFull(row: number): boolean {
    this.#assertValidRow(row);

    return this.#grid[row] === Matrix.#FULL_ROW;
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
    this.#grid.fill(0);
  }

  toArray(): boolean[][] {
    return Array.from({ length: Matrix.ROW_COUNT }, (_, y) =>
      // oxlint-disable-next-line no-shadow
      Array.from({ length: Matrix.COLUMN_COUNT }, (_, x) => !this.isCellEmpty({ x, y })),
    );
  }
}
