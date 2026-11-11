#!/usr/bin/env node

import process from "node:process";
import { styleText } from "node:util";

import { consola } from "consola";

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

  if (!game.hasQuit) {
    game.quit();
  }

  teardownTerminal(keypressHandler);

  consola.box(styleText("bold", `Last Score: ${styleText("greenBright", game.getStats().score.toLocaleString())}`));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  shutdown();

  consola.error("Uncaught exception:", err);

  process.exit(1);
});

setupTerminal(keypressHandler);

new GameLoop(game, shutdown).start();
