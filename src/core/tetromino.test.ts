import { describe, expect, it } from "vitest";

import { type MinoPositions, Tetromino } from "./tetromino.ts";

const MINO_POSITIONS_BY_ROTATION = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
  ],
  [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -2, y: 0 },
    { x: -3, y: 0 },
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 0, y: -3 },
  ],
] as const satisfies MinoPositions[];

class TestTetromino extends Tetromino {
  constructor() {
    super(MINO_POSITIONS_BY_ROTATION);
  }
}

describe(Tetromino, () => {
  describe("constructor", () => {
    it("assigns the provided mino positions", () => {
      const tetromino = new TestTetromino();

      expect(tetromino.minoPositionsByRotation).toBe(MINO_POSITIONS_BY_ROTATION);
    });
  });

  describe("getMinoPositions", () => {
    it("returns the current mino positions", () => {
      const tetromino = new TestTetromino();

      expect(tetromino.getMinoPositions()).toStrictEqual(tetromino.minoPositionsByRotation[0]);
    });

    it("returns independent position objects", () => {
      const tetromino = new TestTetromino();

      const minoPositions = tetromino.getMinoPositions();

      Object.assign(minoPositions[0]!, { x: 100, y: 100 });

      expect(tetromino.getMinoPositions()).toStrictEqual(tetromino.minoPositionsByRotation[0]);
    });
  });

  describe("move", () => {
    it("applies the specified movement offsets", () => {
      const tetromino = new TestTetromino();

      const deltaX = 2;
      const deltaY = -3;

      tetromino.move(deltaX, deltaY);

      expect(tetromino.getMinoPositions()).toStrictEqual(
        tetromino.minoPositionsByRotation[0]!.map(({ x, y }) => ({ x: x + deltaX, y: y + deltaY })),
      );
    });
  });

  describe("moveLeft", () => {
    it("moves the minos one cell to the left", () => {
      const tetromino = new TestTetromino();

      tetromino.moveLeft();

      expect(tetromino.getMinoPositions()).toStrictEqual(
        tetromino.minoPositionsByRotation[0]!.map(({ x, y }) => ({ x: x - 1, y })),
      );
    });
  });

  describe("moveRight", () => {
    it("moves the minos one cell to the right", () => {
      const tetromino = new TestTetromino();

      tetromino.moveRight();

      expect(tetromino.getMinoPositions()).toStrictEqual(
        tetromino.minoPositionsByRotation[0]!.map(({ x, y }) => ({ x: x + 1, y })),
      );
    });
  });

  describe("moveUp", () => {
    it("moves the minos one cell up", () => {
      const tetromino = new TestTetromino();

      tetromino.moveUp();

      expect(tetromino.getMinoPositions()).toStrictEqual(
        tetromino.minoPositionsByRotation[0]!.map(({ x, y }) => ({ x, y: y - 1 })),
      );
    });
  });

  describe("moveDown", () => {
    it("moves the minos one cell down", () => {
      const tetromino = new TestTetromino();

      tetromino.moveDown();

      expect(tetromino.getMinoPositions()).toStrictEqual(
        tetromino.minoPositionsByRotation[0]!.map(({ x, y }) => ({ x, y: y + 1 })),
      );
    });
  });

  describe("rotate", () => {
    it("advances to the next rotation", () => {
      const tetromino = new TestTetromino();

      tetromino.rotate();

      expect(tetromino.getMinoPositions()).toStrictEqual(tetromino.minoPositionsByRotation[1]);
    });

    it("wraps around to the initial rotation", () => {
      const tetromino = new TestTetromino();

      for (let i = 0; i < 4; i++) {
        tetromino.rotate();
      }

      expect(tetromino.getMinoPositions()).toStrictEqual(tetromino.minoPositionsByRotation[0]);
    });

    it("preserves the movement offsets", () => {
      const tetromino = new TestTetromino();

      const deltaX = 2;
      const deltaY = -3;

      tetromino.move(deltaX, deltaY);

      tetromino.rotate();

      expect(tetromino.getMinoPositions()).toStrictEqual(
        tetromino.minoPositionsByRotation[1]!.map(({ x, y }) => ({ x: x + deltaX, y: y + deltaY })),
      );
    });
  });

  describe("undoRotate", () => {
    it("reverts back to the previous rotation", () => {
      const tetromino = new TestTetromino();

      tetromino.rotate();

      tetromino.undoRotate();

      expect(tetromino.getMinoPositions()).toStrictEqual(tetromino.minoPositionsByRotation[0]);
    });

    it("wraps around to the last rotation", () => {
      const tetromino = new TestTetromino();

      tetromino.undoRotate();

      expect(tetromino.getMinoPositions()).toStrictEqual(tetromino.minoPositionsByRotation.at(-1));
    });
  });
});
