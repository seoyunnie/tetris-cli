import { describe, expect, it } from "vitest";

import { Matrix, type Position } from "./matrix.ts";

function createMatrixArray(state: readonly (readonly boolean[])[] = []): boolean[][] {
  return Array.from({ length: Matrix.ROW_COUNT }, (_, y) =>
    // oxlint-disable-next-line no-shadow
    Array.from({ length: Matrix.COLUMN_COUNT }, (_, x) => state[y]?.[x] ?? false),
  );
}

function createFullRow(): true[] {
  return Array.from({ length: Matrix.COLUMN_COUNT }, () => true);
}

const INVALID_POSITIONS = [
  { x: Matrix.COLUMN_COUNT, y: 0 },
  { x: 0, y: Matrix.ROW_COUNT },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 1.5, y: 0 },
  { x: 0, y: 1.5 },
  { x: Number.NaN, y: 0 },
  { x: 0, y: Number.NaN },
] as const satisfies Position[];

// oxlint-disable-next-line promise/prefer-await-to-callbacks
function expectInvalidPosition(cb: (pos: Position) => unknown): void {
  for (const pos of INVALID_POSITIONS) {
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    expect(() => cb(pos)).toThrow(RangeError);
  }
}

const INVALID_ROWS = [Matrix.ROW_COUNT, -1, 1.5, Number.NaN] as const;

// oxlint-disable-next-line promise/prefer-await-to-callbacks
function expectInvalidRow(cb: (row: number) => unknown): void {
  for (const row of INVALID_ROWS) {
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    expect(() => cb(row)).toThrow(RangeError);
  }
}

describe(Matrix, () => {
  describe("constructor", () => {
    it("creates an empty matrix when no initial state is provided", () => {
      const matrix = new Matrix();

      expect(matrix.toArray()).toStrictEqual(createMatrixArray());
    });

    it("creates an empty matrix when an empty initial state is provided", () => {
      const matrix = new Matrix([]);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray());
    });

    it("initializes cells from the provided state", () => {
      const initialState = createMatrixArray([
        [true, false, true],
        [false, true],
        [true, true, true, true],
      ]);

      const matrix = new Matrix(initialState);

      expect(matrix.toArray()).toStrictEqual(initialState);
    });

    it("treats omitted cells as empty", () => {
      const initialState = [[true, false, true], [], [false, true], [], [true, true, true, true]];

      const matrix = new Matrix(initialState);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray(initialState));
    });

    it("throws a `RangeError` when the initial state has too many rows", () => {
      const initialState = Array.from({ length: Matrix.ROW_COUNT + 1 }, () =>
        Array.from({ length: Matrix.COLUMN_COUNT }, () => false),
      );

      expect(() => new Matrix(initialState)).toThrow(RangeError);
    });

    it("throws a `RangeError` when an initial row has too many columns", () => {
      const initialRow = Array.from({ length: Matrix.COLUMN_COUNT + 1 }, () => false);

      expect(() => new Matrix([initialRow])).toThrow(RangeError);
    });
  });

  describe("isInside", () => {
    it("returns true for cells inside the matrix", () => {
      const matrix = new Matrix();

      expect(matrix.isInside({ x: 0, y: 0 })).toBe(true);
      expect(matrix.isInside({ x: Matrix.COLUMN_COUNT - 1, y: Matrix.ROW_COUNT - 1 })).toBe(true);
      expect(matrix.isInside({ x: 0, y: Matrix.ROW_COUNT - 1 })).toBe(true);
      expect(matrix.isInside({ x: Matrix.COLUMN_COUNT - 1, y: 0 })).toBe(true);
    });

    it("returns false for cells outside the matrix", () => {
      const matrix = new Matrix();

      expect(matrix.isInside({ x: -1, y: -1 })).toBe(false);
      expect(matrix.isInside({ x: Matrix.COLUMN_COUNT, y: Matrix.ROW_COUNT })).toBe(false);
      expect(matrix.isInside({ x: 0, y: Matrix.ROW_COUNT })).toBe(false);
      expect(matrix.isInside({ x: Matrix.COLUMN_COUNT, y: 0 })).toBe(false);
    });
  });

  describe("fillCell", () => {
    it("fills the specified cell", () => {
      const matrix = new Matrix();

      const pos = { x: 3, y: 5 } satisfies Position;

      matrix.fillCell(pos);

      expect(matrix.isCellEmpty(pos)).toBe(false);
    });

    it("does not affect other cells", () => {
      const matrix = new Matrix();

      const pos = { x: 3, y: 5 } satisfies Position;

      matrix.fillCell(pos);

      expect(matrix.isCellEmpty({ x: pos.y, y: pos.x })).toBe(true);
      expect(matrix.isCellEmpty({ x: pos.x - 1, y: pos.y })).toBe(true);
      expect(matrix.isCellEmpty({ x: pos.x + 1, y: pos.y })).toBe(true);
      expect(matrix.isCellEmpty({ x: pos.x, y: pos.y - 1 })).toBe(true);
      expect(matrix.isCellEmpty({ x: pos.x, y: pos.y + 1 })).toBe(true);
    });

    it("throws a `RangeError` when the position is invalid", () => {
      const matrix = new Matrix();

      expectInvalidPosition((p) => {
        matrix.fillCell(p);
      });
    });
  });

  describe("clearCell", () => {
    it("clears the specified cell", () => {
      const matrix = new Matrix([[true]]);

      const pos = { x: 0, y: 0 } satisfies Position;

      matrix.clearCell(pos);

      expect(matrix.isCellEmpty(pos)).toBe(true);
    });

    it("does not affect other filled cells", () => {
      const matrix = new Matrix([[true, true]]);

      const pos = { x: 0, y: 0 } satisfies Position;

      matrix.clearCell(pos);

      expect(matrix.isCellEmpty(pos)).toBe(true);
      expect(matrix.isCellEmpty({ x: 1, y: 0 })).toBe(false);
    });

    it("throws a `RangeError` when the position is invalid", () => {
      const matrix = new Matrix();

      expectInvalidPosition((p) => {
        matrix.clearCell(p);
      });
    });
  });

  describe("isCellEmpty", () => {
    it("returns true for an empty cell", () => {
      const matrix = new Matrix();

      expect(matrix.isCellEmpty({ x: 3, y: 5 })).toBe(true);
    });

    it("returns false for a filled cell", () => {
      const matrix = new Matrix([[true]]);

      const pos = { x: 0, y: 0 } satisfies Position;

      expect(matrix.isCellEmpty(pos)).toBe(false);
    });

    it("throws a `RangeError` when the position is invalid", () => {
      const matrix = new Matrix();

      expectInvalidPosition((p) => matrix.isCellEmpty(p));
    });
  });

  describe("clearRow", () => {
    it("clears all cells in the specified row", () => {
      const initialState = [
        [true, true, true],
        [true, true, true],
      ];

      const matrix = new Matrix(initialState);

      const row = 0;

      matrix.clearRow(row);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray(initialState.with(row, [])));
    });

    it("does not affect other rows", () => {
      const initialState = [[true], [true], [true]];

      const matrix = new Matrix(initialState);

      const row = 1;

      matrix.clearRow(row);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray(initialState.with(row, [])));
    });

    it("throws a `RangeError` when the row is invalid", () => {
      const matrix = new Matrix();

      expectInvalidRow((r) => {
        matrix.clearRow(r);
      });
    });
  });

  describe("deleteRow", () => {
    it("deletes the specified row and shifts rows above it down", () => {
      const initialState = [
        [true, false],
        [false, true],
        [true, true],
      ];

      const matrix = new Matrix(initialState);

      const row = 1;

      matrix.deleteRow(row);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray([[], ...initialState.toSpliced(row, 1)]));
    });

    it("clears the first row when deleting it", () => {
      const initialState = [
        [true, true],
        [false, true],
      ];

      const matrix = new Matrix(initialState);

      const row = 0;

      matrix.deleteRow(row);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray(initialState.with(row, [])));
    });

    it("throws a `RangeError` when the row is invalid", () => {
      const matrix = new Matrix();

      expectInvalidRow((r) => {
        matrix.deleteRow(r);
      });
    });
  });

  describe("isRowFull", () => {
    it("returns true when every cell in the row is filled", () => {
      const matrix = new Matrix([createFullRow()]);

      expect(matrix.isRowFull(0)).toBe(true);
    });

    it("returns false when at least one cell in the row is empty", () => {
      const initialRow: boolean[] = createFullRow();
      initialRow[Matrix.COLUMN_COUNT - 1] = false;

      const matrix = new Matrix([initialRow]);

      expect(matrix.isRowFull(0)).toBe(false);
    });

    it("throws a `RangeError` when the row is invalid", () => {
      const matrix = new Matrix();

      expectInvalidRow((r) => matrix.isRowFull(r));
    });
  });

  describe("clearFullRows", () => {
    it("returns `0` when there are no full rows", () => {
      const matrix = new Matrix();

      const res = matrix.clearFullRows().next();

      expect(res).toStrictEqual({ done: true, value: 0 } satisfies IteratorResult<void, number>);
      expect(matrix.toArray()).toStrictEqual(createMatrixArray());
    });

    it("clears a full row and shifts rows above it down", () => {
      const initialState = [[true], [false, true], createFullRow()];

      const matrix = new Matrix(initialState);

      const iter = matrix.clearFullRows();

      let res = iter.next();

      while (res.done !== true) {
        res = iter.next();
      }

      expect(matrix.toArray()).toStrictEqual(createMatrixArray([[], ...initialState.slice(0, 2)]));
    });

    it("clears consecutive full rows and returns their count", () => {
      const initialState = [[true], createFullRow(), createFullRow()];

      const matrix = new Matrix(initialState);

      const iter = matrix.clearFullRows();

      let res = iter.next();

      while (res.done !== true) {
        res = iter.next();
      }

      expect(matrix.toArray()).toStrictEqual(createMatrixArray([[], [], initialState[0]!]));
      expect(res.value).toBe(2);
    });

    it("clears non-consecutive full rows and returns their count", () => {
      const initialState = [[true], createFullRow(), [false, true], createFullRow()];

      const matrix = new Matrix(initialState);

      const iter = matrix.clearFullRows();

      let res = iter.next();

      while (res.done !== true) {
        res = iter.next();
      }

      expect(matrix.toArray()).toStrictEqual(createMatrixArray([[], [], initialState[0]!, initialState[2]!]));
      expect(res.value).toBe(2);
    });

    it("yields once for each cell in every cleared row", () => {
      const initialState = Array.from({ length: 2 }, () => createFullRow());

      const matrix = new Matrix(initialState);

      const iter = matrix.clearFullRows();

      let yieldCnt = 0;
      let res = iter.next();

      while (res.done !== true) {
        yieldCnt++;
        res = iter.next();
      }

      expect(yieldCnt).toBe(Matrix.COLUMN_COUNT * initialState.length);
    });
  });

  describe("reset", () => {
    it("clears all cells in the matrix", () => {
      const matrix = new Matrix([[true, false, true], [false, true], createFullRow()]);

      matrix.reset();

      expect(matrix.toArray()).toStrictEqual(createMatrixArray());
    });
  });

  describe("toArray", () => {
    it("returns the current matrix state", () => {
      const state = [
        [true, false, true],
        [false, true],
      ];

      const matrix = new Matrix(state);

      expect(matrix.toArray()).toStrictEqual(createMatrixArray(state));
    });

    it("returns an independent array", () => {
      const state = [
        [true, false, true],
        [false, true],
      ];

      const matrix = new Matrix(state);
      const matrixArr = matrix.toArray();

      matrixArr[0]![0] = false;

      expect(matrix.toArray()).toStrictEqual(createMatrixArray(state));
    });

    it("returns a new array on each call", () => {
      const matrix = new Matrix();

      const first = matrix.toArray();
      const second = matrix.toArray();

      expect(first).not.toBe(second);

      for (let row = 0; row < Matrix.ROW_COUNT; row++) {
        expect(first[row]).not.toBe(second[row]);
      }
    });
  });
});
