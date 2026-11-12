import { describe, expect, it } from "vitest";
import { extras, packs, productById, products } from "@/data/catalogue";

describe("catalogue", () => {
  it("has 20 products, 6 packs, 4 extras", () => {
    expect(products).toHaveLength(20);
    expect(packs).toHaveLength(6);
    expect(extras).toHaveLength(4);
  });

  it("pack prices match the owner's rulings", () => {
    const p = (id: string) => packs.find((x) => x.id === id)!;
    expect(p("vape-pro")).toMatchObject({ setup: 7000, monthly: 650, marketY1: 55650, separatelyY1: 32920 });
    expect(p("vape-complete")).toMatchObject({ setup: 11000, monthly: 750 });
    expect(p("vape-starter").defaultFloor).toBe(3500);
    expect(p("retail-online")).toMatchObject({ setup: 4000, monthly: 800 });
  });

  it("every pack productId resolves, with no duplicates", () => {
    for (const pack of packs) {
      for (const id of pack.productIds) expect(productById(id), `${pack.id}:${id}`).toBeDefined();
      expect(new Set(pack.productIds).size).toBe(pack.productIds.length);
    }
  });
});
