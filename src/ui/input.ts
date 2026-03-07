import type { Interface } from "node:readline";

import type { Game } from "../core/game.ts";

export function createKeyHandler(game: Game): Interface["write"] {
  return function onKeyPress(_, key) {
    if (key?.name == null) {
      return;
    }

    switch (key.name) {
      case "r":
        game.isOver = false;

        game.reset();

        return;
      case "q":
        game.stop();

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
