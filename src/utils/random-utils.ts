export function popRandom<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  const [elm] = arr.splice(idx, 1);

  return elm!;
}
