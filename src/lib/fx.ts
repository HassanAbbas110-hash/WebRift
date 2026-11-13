// Pure logic for the motion layer and the phone demos. Demo data is sample data only: generic names, no real brands.

/** Global constraint: static hero on reduced motion, <= 4 cores (or unknown), or no WebGL. */
export function shouldUseStaticHero({ reducedMotion, cores, webgl }: { reducedMotion: boolean; cores?: number; webgl: boolean }) {
  return reducedMotion || !webgl || !(cores !== undefined && cores > 4);
}

// --- CoilFinder ---
export type Device = { id: string; brand: string; name: string };
export type Part = { id: string; name: string; detail: string; fits: string[] };

export const DEVICES: Device[] = [
  { id: "nova-pod-2", brand: "Nova", name: "Nova Pod 2" },
  { id: "nova-pod-mini", brand: "Nova", name: "Nova Pod Mini" },
  { id: "arc-mod-80", brand: "Arc", name: "Arc Mod 80W" },
  { id: "arc-stick-40", brand: "Arc", name: "Arc Stick 40W" },
  { id: "zephyr-x", brand: "Zephyr", name: "Zephyr X" },
];

export const PARTS: Part[] = [
  { id: "np-08", name: "Nova 0.8Ω mesh pod", detail: "2-pack · MTL", fits: ["nova-pod-2", "nova-pod-mini"] },
  { id: "np-12", name: "Nova 1.2Ω pod", detail: "2-pack · tight MTL", fits: ["nova-pod-2"] },
  { id: "np-06m", name: "Nova Mini 0.6Ω pod", detail: "3-pack", fits: ["nova-pod-mini"] },
  { id: "ac-04", name: "Arc 0.4Ω mesh coil", detail: "5-pack · DTL", fits: ["arc-mod-80", "arc-stick-40"] },
  { id: "ac-02", name: "Arc 0.2Ω mesh coil", detail: "5-pack · 60–80W", fits: ["arc-mod-80"] },
  { id: "at-5", name: "Arc 5ml replacement tank", detail: "Glass", fits: ["arc-mod-80"] },
  { id: "zx-pod", name: "Zephyr X empty pod 0.7Ω", detail: "2-pack · refillable", fits: ["zephyr-x"] },
];

export const brands = () => [...new Set(DEVICES.map((d) => d.brand))];
export const compatible = (deviceId: string) => PARTS.filter((p) => p.fits.includes(deviceId));

// --- FlavourFinder ---
export type FlavourAnswers = { family: string; cool: string; sweet: string; device: string; size: string };
type FQ = { key: keyof FlavourAnswers; title: string; options: [string, string][] };

export const FLAVOUR_QUESTIONS: FQ[] = [
  { key: "family", title: "Which flavour family?", options: [["fruit", "Fruity"], ["dessert", "Dessert"], ["menthol", "Mint / menthol"], ["tobacco", "Tobacco"]] },
  { key: "cool", title: "Cooling?", options: [["ice", "Yes, icy"], ["none", "No ice"]] },
  { key: "sweet", title: "How sweet?", options: [["sweet", "Sweet"], ["subtle", "Subtle"]] },
  { key: "device", title: "Which device?", options: [["salt", "Pod (nic salt)"], ["freebase", "Mod (freebase)"]] },
  { key: "size", title: "Bottle size?", options: [["30ml", "30ml"], ["60ml", "60ml"]] },
];

export type Flavour = { name: string; tags: string[] };
export const FLAVOURS: Flavour[] = [
  { name: "Mango Ice", tags: ["fruit", "ice", "sweet", "salt", "30ml"] },
  { name: "Berry Blast", tags: ["fruit", "none", "sweet", "freebase", "60ml"] },
  { name: "Watermelon Chill", tags: ["fruit", "ice", "subtle", "salt", "30ml"] },
  { name: "Lychee Frost", tags: ["fruit", "ice", "subtle", "freebase", "60ml"] },
  { name: "Vanilla Custard", tags: ["dessert", "none", "sweet", "freebase", "60ml"] },
  { name: "Apple Crumble", tags: ["dessert", "none", "sweet", "salt", "30ml"] },
  { name: "Cool Mint", tags: ["menthol", "ice", "subtle", "salt", "30ml"] },
  { name: "Spearmint Breeze", tags: ["menthol", "ice", "sweet", "freebase", "60ml"] },
  { name: "Caramel Tobacco", tags: ["tobacco", "none", "sweet", "freebase", "60ml"] },
  { name: "Classic Tobacco", tags: ["tobacco", "none", "subtle", "salt", "30ml"] },
];

// Flavour family and cooling matter most; the rest break ties. Sort is stable, so equal scores keep list order.
const WEIGHT: Record<keyof FlavourAnswers, number> = { family: 4, cool: 3, sweet: 1, device: 1, size: 1 };
export function pickFlavours(a: FlavourAnswers): Flavour[] {
  const score = (f: Flavour) => (Object.keys(WEIGHT) as (keyof FlavourAnswers)[]).reduce((s, k) => s + (f.tags.includes(a[k]) ? WEIGHT[k] : 0), 0);
  return [...FLAVOURS].sort((x, y) => score(y) - score(x)).slice(0, 3);
}

// --- LoyaltyCard ---
export type Card = { stamps: number; reward: boolean };
export const STAMPS_FOR_REWARD = 10;
/** One stamp; the 10th shows the reward, and the next tap starts a fresh card. */
export function stamp(c: Card): Card {
  if (c.reward) return { stamps: 1, reward: false };
  const stamps = c.stamps + 1;
  return { stamps, reward: stamps === STAMPS_FOR_REWARD };
}
