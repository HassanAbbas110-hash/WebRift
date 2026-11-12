import { describe, expect, it } from "vitest";
import { clearFloor, getFloors, setFloor, validUntilFrom } from "@/lib/db";

describe("db helpers", () => {
  it("validUntil uses the Johannesburg date + 14 days", () => {
    expect(validUntilFrom(new Date("2026-11-11T22:00:00Z"))).toBe("2026-11-26");
  });
  it("setFloor stores only overrides; defaults still merged on read", async () => {
    await setFloor("vape-pro", 6000);
    expect(await getFloors()).toMatchObject({ "vape-pro": 6000, "vape-starter": 3500 });
    await setFloor("vape-starter", 3000);
    expect((await getFloors())["vape-pro"]).toBe(6000);
  });
  it("clearFloor removes the override, back to catalogue default", async () => {
    await setFloor("vape-starter", 3000);
    await clearFloor("vape-starter");
    expect((await getFloors())["vape-starter"]).toBe(3500);
  });
});
