import { describe, expect, it } from "vitest";
import { CITY_COORDS } from "@/components/fx/CityMap";
import { cities } from "@/data/catalogue";
import { DEVICES, FLAVOUR_QUESTIONS, compatible, pickFlavours, shouldUseStaticHero, stamp, type FlavourAnswers } from "@/lib/fx";

describe("shouldUseStaticHero", () => {
  it("uses the shader only with motion allowed, >4 cores and WebGL", () => {
    expect(shouldUseStaticHero({ reducedMotion: false, cores: 8, webgl: true })).toBe(false);
  });
  it("falls back on reduced motion, <=4 cores, unknown cores or no WebGL", () => {
    expect(shouldUseStaticHero({ reducedMotion: true, cores: 8, webgl: true })).toBe(true);
    expect(shouldUseStaticHero({ reducedMotion: false, cores: 4, webgl: true })).toBe(true);
    expect(shouldUseStaticHero({ reducedMotion: false, cores: undefined, webgl: true })).toBe(true);
    expect(shouldUseStaticHero({ reducedMotion: false, cores: 8, webgl: false })).toBe(true);
  });
});

describe("CoilFinder compatible()", () => {
  it("returns only parts that fit the chosen device, and every device has some", () => {
    for (const d of DEVICES) {
      const parts = compatible(d.id);
      expect(parts.length).toBeGreaterThan(0);
      for (const p of parts) expect(p.fits).toContain(d.id);
    }
  });
  it("returns nothing for an unknown device", () => {
    expect(compatible("nope")).toEqual([]);
  });
});

describe("FlavourFinder pickFlavours()", () => {
  const answers = Object.fromEntries(FLAVOUR_QUESTIONS.map((q) => [q.key, q.options[0][0]])) as FlavourAnswers;
  it("returns 3 distinct picks", () => {
    const picks = pickFlavours(answers);
    expect(picks).toHaveLength(3);
    expect(new Set(picks.map((p) => p.name)).size).toBe(3);
  });
  it("puts a cooling flavour first when the customer wants ice", () => {
    expect(pickFlavours({ ...answers, family: "fruit", cool: "ice" })[0].tags).toContain("ice");
    expect(pickFlavours({ ...answers, family: "dessert", cool: "none" })[0].tags).toContain("dessert");
  });
});

describe("LoyaltyCard stamp()", () => {
  it("shows the reward on the 10th stamp only, then starts a new card", () => {
    let s = { stamps: 0, reward: false };
    for (let i = 1; i <= 9; i++) {
      s = stamp(s);
      expect(s).toEqual({ stamps: i, reward: false });
    }
    s = stamp(s);
    expect(s).toEqual({ stamps: 10, reward: true });
    expect(stamp(s)).toEqual({ stamps: 1, reward: false });
  });
});

describe("CityMap", () => {
  it("has a position for every catalogue city", () => {
    for (const c of cities) expect(CITY_COORDS[c]).toBeDefined();
  });
});
