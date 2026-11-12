import { describe, expect, it } from "vitest";
import { DEFAULT_FLOORS } from "@/lib/floors";
import { packs } from "@/data/catalogue";

describe("floors", () => {
  it("default floor lives server-side, not in the public catalogue", () => {
    expect(DEFAULT_FLOORS).toEqual({ "vape-starter": 3500 });
    expect(JSON.stringify(packs)).not.toMatch(/floor/i);
  });
});
