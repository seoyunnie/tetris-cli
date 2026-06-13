export function wrap(num: number, limit: number): number {
  if (limit <= 0) {
    throw new RangeError(`limit must be greater than 0, got ${limit}`);
  }

  return ((num % limit) + limit) % limit;
}
