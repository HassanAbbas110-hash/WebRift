import { describe, expect, it } from "vitest";
import { waLink } from "@/lib/site";

describe("smoke", () => {
  it("runs", () => {
    expect(1).toBe(1);
  });

  it("builds an encoded wa.me link", () => {
    expect(waLink("Hi & bye")).toBe("https://wa.me/27609658641?text=Hi%20%26%20bye");
  });
});
