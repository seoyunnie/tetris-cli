import { emitKeypressEvents } from "node:readline";

const ANSI_ALTERNATE_SCREEN_BUFFER = "\u001B[?1049h";
const ANSI_MAIN_SCREEN_BUFFER = "\u001B[?1049l";

const ANSI_CURSOR_INVISIBLE = "\u001B[?25l";
const ANSI_CURSOR_VISIBLE = "\u001B[?25h";

const ANSI_COLOR_GREEN = "\u001B[1;32m";
const ANSI_COLOR_RESET = "\u001B[0m";

export function setupTerminal(): void {
  process.stdin.setRawMode(true);
  emitKeypressEvents(process.stdin);

  process.stdout.write(ANSI_ALTERNATE_SCREEN_BUFFER);
  process.stdout.write(ANSI_CURSOR_INVISIBLE);

  process.stdout.write(ANSI_COLOR_GREEN);
}

export function teardownTerminal(): void {
  process.stdout.write(ANSI_COLOR_RESET);

  process.stdout.write(ANSI_MAIN_SCREEN_BUFFER);
  process.stdout.write(ANSI_CURSOR_VISIBLE);
}
