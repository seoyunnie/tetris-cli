import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Game } from "../core/game.ts";
import { createKeypressHandler } from "./input.ts";

describe(createKeypressHandler, () => {
  const game = {
    isOver: false,

    moveLeft: vi.fn<() => void>(),
    moveRight: vi.fn<() => void>(),
    moveDown: vi.fn<(awardScore?: boolean) => void>(),
    hardDrop: vi.fn<() => void>(),
    rotate: vi.fn<() => void>(),
    reset: vi.fn<() => void>(),
    quit: vi.fn<() => void>(),
  };

  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const handler = createKeypressHandler(game as unknown as Game);

  function pressKey(name?: string): void {
    handler("", { name });
  }

  beforeEach(() => {
    game.isOver = false;

    vi.clearAllMocks();
  });

  it.for(["left", "a"])("moves the tetromino left when '%s' is pressed", (key) => {
    pressKey(key);

    expect(game.moveLeft).toHaveBeenCalledOnce();
  });

  it.for(["right", "d"])("moves the tetromino right when '%s' is pressed", (key) => {
    pressKey(key);

    expect(game.moveRight).toHaveBeenCalledOnce();
  });

  it.for(["down", "s"])("moves the tetromino down when '%s' is pressed", (key) => {
    pressKey(key);

    expect(game.moveDown).toHaveBeenCalledExactlyOnceWith(true);
  });

  it("hard drops the tetromino when 'space' is pressed", () => {
    pressKey("space");

    expect(game.hardDrop).toHaveBeenCalledOnce();
  });

  it.for(["up", "w"])("rotates the tetromino when '%s' is pressed", (key) => {
    pressKey(key);

    expect(game.rotate).toHaveBeenCalledOnce();
  });

  it("resets the game when 'r' is pressed", () => {
    pressKey("r");

    expect(game.reset).toHaveBeenCalledOnce();
  });

  it.for(["q", "escape"])("quits the game when '%s' is pressed", (key) => {
    pressKey(key);

    expect(game.quit).toHaveBeenCalledOnce();
  });

  it("does nothing when the key name is undefined", () => {
    pressKey();

    expect(game.moveLeft).not.toHaveBeenCalled();
    expect(game.moveRight).not.toHaveBeenCalled();
    expect(game.moveDown).not.toHaveBeenCalled();
    expect(game.hardDrop).not.toHaveBeenCalled();
    expect(game.rotate).not.toHaveBeenCalled();
    expect(game.reset).not.toHaveBeenCalled();
    expect(game.quit).not.toHaveBeenCalled();
  });

  it("does nothing when an unsupported key is pressed", () => {
    pressKey("x");

    expect(game.moveLeft).not.toHaveBeenCalled();
    expect(game.moveRight).not.toHaveBeenCalled();
    expect(game.moveDown).not.toHaveBeenCalled();
    expect(game.hardDrop).not.toHaveBeenCalled();
    expect(game.rotate).not.toHaveBeenCalled();
    expect(game.reset).not.toHaveBeenCalled();
    expect(game.quit).not.toHaveBeenCalled();
  });

  describe("when the game is over", () => {
    it.for([
      ["left", "moveLeft"],
      ["a", "moveLeft"],
      ["right", "moveRight"],
      ["d", "moveRight"],
      ["down", "moveDown"],
      ["s", "moveDown"],
      ["space", "hardDrop"],
      ["up", "rotate"],
      ["w", "rotate"],
    ] as const)("ignores '%s'", ([key, method]) => {
      game.isOver = true;

      pressKey(key);

      expect(game[method]).not.toHaveBeenCalled();
    });

    it("resets the game when 'r' is pressed", () => {
      game.isOver = true;

      pressKey("r");

      expect(game.reset).toHaveBeenCalledOnce();
    });

    it.for(["q", "escape"])("quits the game when '%s' is pressed", (key) => {
      game.isOver = true;

      pressKey(key);

      expect(game.quit).toHaveBeenCalledOnce();
    });
  });
});
