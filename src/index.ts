#!/usr/bin/env node

import { GameLoop } from "./core/game-loop.ts";
import { Game } from "./core/game.ts";
import { createKeypressHandler } from "./ui/input.ts";
import { setupTerminal, teardownTerminal } from "./ui/terminal.ts";

const game = new Game();

const keypressHandler = createKeypressHandler(game);

let isShuttingDown = false;

function shutdown(): void {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  game.quit();

  teardownTerminal(keypressHandler);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  shutdown();

  console.error(err);

  process.exitCode = 1;
});
process.on("unhandledRejection", (reason) => {
  throw Error.isError(reason) ? reason : new Error("Unhandled promise rejection", { cause: reason });
});

setupTerminal(keypressHandler);

new GameLoop(game, shutdown).start();
