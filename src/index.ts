#!/usr/bin/env node

import { Game } from "./core/game.ts";
import { createKeyHandler } from "./ui/input.ts";
import { render } from "./ui/renderer.ts";
import { setupTerminal, teardownTerminal } from "./ui/terminal.ts";

const game = new Game();

setupTerminal();
process.stdin.on("keypress", createKeyHandler(game));

const MS_PER_SECOND = 1000;

const FPS = 60;
const FRAME_MS = MS_PER_SECOND / FPS;

const GRAVITY_MS = 800;

const gameLoop = setInterval(() => {
  if (!game.isRunning) {
    shutdown();

    return;
  }

  render(game);
}, FRAME_MS);
const gravityLoop = setInterval(() => {
  if (game.isOver) {
    return;
  }

  game.moveDown();
}, GRAVITY_MS);

function shutdown(): void {
  clearInterval(gameLoop);
  clearInterval(gravityLoop);

  teardownTerminal();

  process.exit(0);
}
