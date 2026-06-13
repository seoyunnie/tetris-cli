export function popRandom(arr: []): undefined;
export function popRandom<T>(arr: [T, ...T[]]): T;
export function popRandom<T>(arr: T[]): T | undefined;

export function popRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return;
  }

  const idx = Math.floor(Math.random() * arr.length);
  const [elm] = arr.splice(idx, 1);

  return elm;
}
