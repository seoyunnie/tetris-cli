import { describe, expect, it } from "vitest";

import {
  ITetromino,
  JTetromino,
  LTetromino,
  OTetromino,
  STetromino,
  TTetromino,
  ZTetromino,
  getNewInstances,
} from "./tetrominoes.ts";

describe.for([
  ["ITetromino", ITetromino, 3, 1],
  ["OTetromino", OTetromino, 4, 0],
  ["TTetromino", TTetromino, 3, 0],
  ["JTetromino", JTetromino, 3, 0],
  ["LTetromino", LTetromino, 3, 0],
  ["STetromino", STetromino, 3, 0],
  ["ZTetromino", ZTetromino, 3, 0],
] as const)("%s", ([, TetrominoClass, deltaX, deltaY]) => {
  it("returns the correct mino positions for each rotation", () => {
    const tetromino = new TetrominoClass();

    for (const minoPositions of tetromino.minoPositionsByRotation) {
      expect(tetromino.getMinoPositions()).toStrictEqual(
        minoPositions.map(({ x, y }) => ({ x: x + deltaX, y: y + deltaY })),
      );

      tetromino.rotate();
    }
  });
});

describe(getNewInstances, () => {
  it("returns all seven tetromino types", () => {
    const tetrominoes = getNewInstances();

    expect(tetrominoes).toHaveLength(7);
    expect(tetrominoes).toStrictEqual(
      expect.arrayContaining([
        expect.any(ITetromino),
        expect.any(OTetromino),
        expect.any(TTetromino),
        expect.any(JTetromino),
        expect.any(LTetromino),
        expect.any(STetromino),
        expect.any(ZTetromino),
      ]),
    );
  });

  it("returns new instances on each call", () => {
    const first = getNewInstances();
    const second = getNewInstances();

    expect(first).not.toBe(second);

    for (const tetromino of first) {
      expect(second).not.toContain(tetromino);
    }
  });
});
