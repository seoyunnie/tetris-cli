import { render } from "../ui/renderer.ts";
import type { Game } from "./game.ts";

const MS_PER_SECOND = 1000;

export class GameLoop {
  static readonly #FPS = 30;

  static readonly #FRAME_DURATION_MS = MS_PER_SECOND / GameLoop.#FPS;
  static readonly #GRAVITY_INTERVAL_MS = 800;

  readonly #game: Game;

  #previousTime = 0;

  #gravityAccumulator = 0;
  #renderAccumulator = 0;

  readonly #onShutdown: () => void;

  constructor(game: Game, onShutdown: () => void) {
    this.#game = game;

    this.#onShutdown = onShutdown;
  }

  #tick(): void {
    if (this.#game.hasQuit) {
      this.#onShutdown();

      return;
    }

    const now = performance.now();
    const deltaTime = now - this.#previousTime;
    this.#previousTime = now;

    this.#gravityAccumulator += deltaTime;
    this.#renderAccumulator += deltaTime;

    while (this.#gravityAccumulator >= GameLoop.#GRAVITY_INTERVAL_MS) {
      if (!this.#game.isOver) {
        this.#game.moveDown();
      }

      this.#gravityAccumulator -= GameLoop.#GRAVITY_INTERVAL_MS;
    }

    if (this.#renderAccumulator >= GameLoop.#FRAME_DURATION_MS) {
      render(this.#game);

      this.#renderAccumulator %= GameLoop.#FRAME_DURATION_MS;
    }

    setImmediate(() => {
      this.#tick();
    });
  }

  start(): void {
    if (this.#game.hasQuit) {
      return;
    }

    this.#previousTime = performance.now();

    this.#tick();
  }
}
