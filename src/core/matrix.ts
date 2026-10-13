export interface Position {
  readonly x: number;
  readonly y: number;
}

export class Matrix {
  static readonly COLUMN_COUNT = 10;
  static readonly ROW_COUNT = 20;

  static readonly #FULL_ROW = (1 << Matrix.COLUMN_COUNT) - 1;

  readonly #grid = new Uint16Array(Matrix.ROW_COUNT);

  fillCell({ x: col, y: row }: Readonly<Position>): void {
    this.#grid[row]! |= 1 << col;
  }

  clearCell({ x: col, y: row }: Readonly<Position>): void {
    this.#grid[row]! &= ~(1 << col);
  }

  isInside({ x: col, y: row }: Readonly<Position>): boolean {
    return col >= 0 && col < Matrix.COLUMN_COUNT && row >= 0 && row < Matrix.ROW_COUNT;
  }

  isCellEmpty({ x: col, y: row }: Readonly<Position>): boolean {
    return (this.#grid[row]! & (1 << col)) === 0;
  }

  isRowFull(row: number): boolean {
    return this.#grid[row] === Matrix.#FULL_ROW;
  }

  clearRow(row: number): void {
    this.#grid[row] = 0;
  }

  deleteRow(row: number): void {
    for (let srcRow = row; srcRow > 0; srcRow--) {
      this.#grid[srcRow] = this.#grid[srcRow - 1]!;
    }

    this.clearRow(0);
  }

  *clearFullRows(): Generator<void, number, void> {
    let fullRowCnt = 0;

    for (let row = Matrix.ROW_COUNT - 1; row >= 0; row--) {
      if (!this.isRowFull(row)) {
        continue;
      }

      for (let col = 0; col < Matrix.COLUMN_COUNT; col++) {
        this.clearCell({ x: col, y: row });

        yield;
      }

      this.deleteRow(row);

      fullRowCnt++;

      row++;
    }

    return fullRowCnt;
  }

  reset(): void {
    this.#grid.fill(0);
  }
}
