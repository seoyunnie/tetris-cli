import { stdin, stdout } from "node:process";
import { emitKeypressEvents } from "node:readline";

import type { KeypressHandler } from "./input.ts";

const ANSI_ALTERNATE_SCREEN_BUFFER = "\u001B[?1049h";
const ANSI_MAIN_SCREEN_BUFFER = "\u001B[?1049l";

const ANSI_CURSOR_INVISIBLE = "\u001B[?25l";
const ANSI_CURSOR_VISIBLE = "\u001B[?25h";

const ANSI_COLOR_GREEN = "\u001B[1;32m";
const ANSI_COLOR_RESET = "\u001B[0m";

export function setupTerminal(onKeypress: KeypressHandler): void {
  if (stdin.isTTY) {
    stdin.setRawMode(true);
  }

  stdin.resume();

  emitKeypressEvents(stdin);
  stdin.on("keypress", onKeypress);

  stdout.write(ANSI_ALTERNATE_SCREEN_BUFFER);
  stdout.write(ANSI_CURSOR_INVISIBLE);

  stdout.write(ANSI_COLOR_GREEN);
}

export function teardownTerminal(onKeypress: KeypressHandler): void {
  stdin.off("keypress", onKeypress);

  stdout.write(ANSI_COLOR_RESET);

  stdout.write(ANSI_MAIN_SCREEN_BUFFER);
  stdout.write(ANSI_CURSOR_VISIBLE);

  stdin.pause();

  if (stdin.isTTY) {
    stdin.setRawMode(false);
  }
}
