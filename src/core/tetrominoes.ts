// oxlint-disable no-magic-numbers

import { Position } from "./matrix.ts";
import { Tetromino } from "./tetromino.ts";

export class ITetromino extends Tetromino {
  constructor() {
    super({
      0: [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(1, 3)],
      1: [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2)],
      2: [new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(2, 3)],
      3: [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1)],
    });

    this.move(3, 1);
  }
}

export class OTetromino extends Tetromino {
  constructor() {
    super({ 0: [new Position(0, 0), new Position(0, 1), new Position(1, 0), new Position(1, 1)] });

    this.move(4, 0);
  }
}

export class TTetromino extends Tetromino {
  constructor() {
    super({
      0: [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
      1: [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
      2: [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
      3: [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 1)],
    });

    this.move(3, 0);
  }
}

export class JTetromino extends Tetromino {
  constructor() {
    super({
      0: [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
      1: [new Position(0, 1), new Position(0, 2), new Position(1, 1), new Position(2, 1)],
      2: [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
      3: [new Position(0, 1), new Position(1, 1), new Position(2, 0), new Position(2, 1)],
    });

    this.move(3, 0);
  }
}

export class LTetromino extends Tetromino {
  constructor() {
    super({
      0: [new Position(0, 2), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
      1: [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
      2: [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 0)],
      3: [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)],
    });

    this.move(3, 0);
  }
}

export class STetromino extends Tetromino {
  constructor() {
    super({
      0: [new Position(0, 1), new Position(0, 2), new Position(1, 0), new Position(1, 1)],
      1: [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
      2: [new Position(1, 1), new Position(1, 2), new Position(2, 0), new Position(2, 1)],
      3: [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)],
    });

    this.move(3, 0);
  }
}

export class ZTetromino extends Tetromino {
  constructor() {
    super({
      0: [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(1, 2)],
      1: [new Position(0, 2), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
      2: [new Position(1, 0), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
      3: [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 0)],
    });

    this.move(3, 0);
  }
}

export function getNewInstances(): Tetromino[] {
  return [
    new ITetromino(),
    new OTetromino(),
    new TTetromino(),
    new JTetromino(),
    new LTetromino(),
    new STetromino(),
    new ZTetromino(),
  ];
}
