import { emitKeypressEvents } from "node:readline";

import type { KeypressHandler } from "./input.ts";

const ANSI_ALTERNATE_SCREEN_BUFFER = "\u001B[?1049h";
const ANSI_MAIN_SCREEN_BUFFER = "\u001B[?1049l";

const ANSI_CURSOR_INVISIBLE = "\u001B[?25l";
const ANSI_CURSOR_VISIBLE = "\u001B[?25h";

const ANSI_COLOR_GREEN = "\u001B[1;32m";
const ANSI_COLOR_RESET = "\u001B[0m";

export function setupTerminal(onKeypress: KeypressHandler): void {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.resume();

  emitKeypressEvents(process.stdin);
  process.stdin.on("keypress", onKeypress);

  process.stdout.write(ANSI_ALTERNATE_SCREEN_BUFFER);
  process.stdout.write(ANSI_CURSOR_INVISIBLE);

  process.stdout.write(ANSI_COLOR_GREEN);
}

export function teardownTerminal(onKeypress: KeypressHandler): void {
  process.stdin.off("keypress", onKeypress);

  process.stdout.write(ANSI_COLOR_RESET);

  process.stdout.write(ANSI_MAIN_SCREEN_BUFFER);
  process.stdout.write(ANSI_CURSOR_VISIBLE);

  process.stdin.pause();

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
}
