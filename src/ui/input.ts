import type { Key } from "node:readline";

import type { Game } from "../core/game.ts";

export type KeypressHandler = (chunk: string, key: Key) => void;

export function createKeypressHandler(game: Game): KeypressHandler {
  return function onKeypress(_, key) {
    if (key.name === undefined) {
      return;
    }

    switch (key.name) {
      case "r":
        game.reset();

        return;
      case "q":
      case "escape":
        game.quit();

        return;
    }

    if (game.isOver) {
      return;
    }

    switch (key.name) {
      case "left":
      case "a":
        game.moveLeft();

        break;
      case "right":
      case "d":
        game.moveRight();

        break;
      case "down":
      case "s":
        game.moveDown(true);

        break;
      case "space":
        game.hardDrop();

        break;
      case "up":
      case "w":
        game.rotate();

        break;
    }
  };
}
