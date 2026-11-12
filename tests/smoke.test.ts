import { describe, expect, it } from "vitest";
import { waLink } from "@/lib/site";

describe("smoke", () => {
  it("runs", () => {
    expect(1).toBe(1);
  });

  it("builds an encoded wa.me link", () => {
    for (const n of ["0027609658641", "+27 60 965 8641", "060 965 8641"]) expect(waLink("x", n)).toContain("wa.me/27609658641?");
    expect(waLink("Hi & bye")).toBe("https://wa.me/27609658641?text=Hi%20%26%20bye");
  });
});
