export function wrap(num: number, max: number): number {
  if (max <= 0) {
    throw new RangeError(`max must be a positive number, received ${max}`);
  }

  return ((num % max) + max) % max;
}
