import { describe, expect, it } from "vitest";

import { wrap } from "./number.ts";

describe(wrap, () => {
  it("returns the number when it is withing the range", () => {
    expect(wrap(3, 10)).toBe(3);
    expect(wrap(3.5, 10)).toBe(3.5);
    expect(wrap(9, 10)).toBe(9);
  });

  it("returns `0` when the number is a multiple of the limit", () => {
    expect(wrap(10, 10)).toBe(0);
    expect(wrap(20, 10)).toBe(0);

    expect(wrap(10.5, 10.5)).toBe(0);
    expect(wrap(21, 10.5)).toBe(0);

    expect(wrap(-10, 10)).toBe(0);
    expect(wrap(-20, 10)).toBe(0);

    expect(wrap(-10.5, 10.5)).toBe(0);
    expect(wrap(-21, 10.5)).toBe(0);
  });

  it("wraps a number greater than the limit to its remainder", () => {
    expect(wrap(13, 10)).toBe(3);
    expect(wrap(13.5, 10)).toBe(3.5);
    expect(wrap(23, 10)).toBe(3);
  });

  it("wraps a negative number to its positive remainder", () => {
    expect(wrap(-3, 10)).toBe(7);
    expect(wrap(-3.5, 10)).toBe(6.5);
    expect(wrap(-13, 10)).toBe(7);
  });

  it("returns `0` when the number is `0`", () => {
    expect(wrap(0, 10)).toBe(0);
  });

  it("returns `NaN` when the number is `NaN`", () => {
    expect(wrap(Number.NaN, 10)).toBeNaN();
  });

  it("returns `NaN` when the limit is `NaN`", () => {
    expect(wrap(3, Number.NaN)).toBeNaN();
  });

  it("throws a `RangeError` when the limit is `0`", () => {
    expect(() => wrap(3, 0)).toThrow(RangeError);
  });

  it("throws a `RangeError` when the limit is negative", () => {
    expect(() => wrap(3, -10)).toThrow(RangeError);
  });
});
