# Tetris CLI

A clone of the popular game Tetris, based on the original Russian Electronika 60 version. It includes most of the game's
features, with some exclusions (e.g., no level system) that may or may not be implemented at a later date.

## How to Play

### Install Dependencies

```sh
pnpm install
```

### Start Game

```sh
pnpm start
```

## Gameplay

![Gameplay Screenshot](./docs/images/gameplay.png)

### Scoring and Game Over

This follows the scoring guideline from [TetrisWiki](https://tetris.wiki/Scoring), excluding T-spins and combos. Also,
due to not having a level system, all scores are based on level 0 (or 1).

#### Scoring Table

| Action    |   Score    |
| --------- | :--------: |
| Single    |    100     |
| Double    |    300     |
| Triple    |    500     |
| Tetris    |    800     |
|           |            |
| Soft Drop | 1 per Cell |
| Hard Drop | 2 per Cell |

### Controls

(_Displayed on Screen_)

| Action             |   Key   | Alternative |
| ------------------ | :-----: | ----------- |
| Move Left          |    ←    | [A]         |
| Move Right         |    →    | [D]         |
| Rotate (Clockwise) |    ↑    | [W]         |
| Soft Drop          |    ↓    | [S]         |
| Hard Drop          | [Space] |             |
|                    |         |             |
| Restart Game       |   [R]   |             |
| Quit Game          |   [Q]   |             |
