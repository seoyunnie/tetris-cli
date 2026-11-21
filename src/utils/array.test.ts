import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { popRandom } from "./array.ts";

describe(popRandom, () => {
  it("removes and returns a randomly selected element", () => {
    using _ = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const arr = ["a", "b", "c", "d"];

    expect(popRandom(arr)).toBe("c");
    expect(arr).toStrictEqual(["a", "b", "d"]);
  });

  it("removes and returns the first element when selected", () => {
    using _ = vi.spyOn(Math, "random").mockReturnValue(0);

    const arr = ["a", "b", "c"];

    expect(popRandom(arr)).toBe("a");
    expect(arr).toStrictEqual(["b", "c"]);
  });

  it("removes and returns the last element when selected", () => {
    using _ = vi.spyOn(Math, "random").mockReturnValue(0.9);

    const arr = ["a", "b", "c"];

    expect(popRandom(arr)).toBe("c");
    expect(arr).toStrictEqual(["a", "b"]);
  });

  it("returns `undefined` when the array is empty", () => {
    const arr: unknown[] = [];

    expect(popRandom(arr)).toBeUndefined();
    expect(arr).toStrictEqual([]);
  });

  it("removes and returns the only element from a single-element array", () => {
    const arr = ["a"];

    expect(popRandom(arr)).toBe("a");
    expect(arr).toStrictEqual([]);
  });

  it("removes and returns only one occurrence of a duplicate element", () => {
    using _ = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const arr = ["a", "b", "a", "c", "a"];

    expect(popRandom(arr)).toBe("a");
    expect(arr).toStrictEqual(["a", "b", "c", "a"]);
  });

  describe("function overloads", () => {
    it("has return type `undefined` for an empty tuple", () => {
      const arr: [] = [];

      // oxlint-disable-next-line typescript/no-confusing-void-expression
      expectTypeOf(popRandom(arr)).toEqualTypeOf<undefined>();
    });

    it("has return type without `undefined` for a non-empty tuple", () => {
      const arr: [string, { id: number }] = ["a", { id: 1 }];

      expectTypeOf(popRandom(arr)).toEqualTypeOf<string | { id: number }>();
    });

    it("has return type with `undefined` for a mutable array", () => {
      const arr = ["a", { id: 1 }];

      expectTypeOf(popRandom(arr)).toEqualTypeOf<string | { id: number } | undefined>();
    });
  });
});
