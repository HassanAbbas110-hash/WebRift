import { describe, expect, it } from "vitest";
import { quoteStatus } from "@/lib/quote";

describe("quoteStatus", () => {
  it("is valid through the last day", () => {
    expect(quoteStatus("2026-11-26", new Date("2026-11-26T20:00"))).toBe("valid");
  });
  it("is expired the day after", () => {
    expect(quoteStatus("2026-11-26", new Date("2026-11-27T00:01"))).toBe("expired");
  });
});
