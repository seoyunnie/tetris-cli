export const DECIMAL_BASE = 10;

export function wrapByDigits(num: number, maxDigits: number): number {
  const limit = DECIMAL_BASE ** maxDigits;

  return ((num % limit) + limit) % limit;
}
