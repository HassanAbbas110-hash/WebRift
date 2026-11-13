import { describe, it, expect } from "vitest";
import { computeQuote, formatZAR, paymentLine, quoteWhatsAppText } from "@/lib/quote";

const q = (i: Partial<Parameters<typeof computeQuote>[0]>, floors = {}) =>
  computeQuote({ productIds: [], extraIds: [], payment: "standard", ...i }, floors);

describe("computeQuote", () => {
  it("vape-pro standard", () => {
    const t = q({ packId: "vape-pro" });
    expect(t).toMatchObject({ setup: 7000, monthly: 650, year1: 14800, prepayTotal: 13500, deposit: 3500, saveVsMarket: 40850, effectiveYear1: 14800, dueNow: 4150 });
  });
  it("vape-pro prepay: year 1 is the prepaid total and savings follow it", () => {
    const t = q({ packId: "vape-pro", payment: "prepay" });
    expect(t).toMatchObject({ year1: 14800, effectiveYear1: 13500, saveVsMarket: 42150, dueNow: 10000 });
    expect(paymentLine(t)).toBe("Year 1 with prepay: R13,500 (setup + 10 months, 2 months free)");
    const s = quoteWhatsAppText("WR-2026-0142", t, "u");
    expect(s).toContain("Year 1 (prepaid): R13,500");
    expect(s).not.toContain("R14,800");
  });
  it("vape-complete instalments", () => {
    const t = q({ packId: "vape-complete", payment: "instalments" });
    expect(t.year1).toBe(20000);
    expect(t.instalment).toBe(3667);
    expect(t.deposit).toBe(3667);
    expect(t.dueNow).toBe(4417);
  });
  it("discount clamped to floor", () => {
    const t = q({ packId: "vape-starter", setupDiscount: 1000 }, { "vape-starter": 3500 });
    expect(t.discountApplied).toBe(500);
    expect(t.setup).toBe(3500);
    expect(t.lines.some((l) => l.kind === "discount" && l.setup === -500)).toBe(true);
  });
  it("no floor means no discount", () => {
    expect(q({ packId: "vape-pro", setupDiscount: 500 }).discountApplied).toBe(0);
  });
  it("negative discount is 0", () => {
    expect(q({ packId: "vape-starter", setupDiscount: -200 }, { "vape-starter": 3500 }).discountApplied).toBe(0);
  });
  it("product in pack is included at 0", () => {
    const t = q({ packId: "vape-starter", productIds: ["google-maps"] });
    expect(t.setup).toBe(4000);
    expect(t.lines.find((l) => l.id === "google-maps")).toMatchObject({ included: true, setup: 0, monthly: 0 });
  });
  it("instalments without pack falls back to standard", () => {
    const t = q({ productIds: ["qr-stand"], payment: "instalments" });
    expect(t.payment).toBe("standard");
    expect(t.instalment).toBeNull();
  });
  it("ignores unknown ids and counts duplicates once", () => {
    const t = q({ productIds: ["qr-stand", "qr-stand", "nope"], extraIds: ["nope", "wifi-capture", "wifi-capture"] });
    expect(t.setup).toBe(850 + 2300);
    expect(t.lines).toHaveLength(2);
  });
  it("loose monthlyOnly product market Y1 = 12 x market.avg", () => {
    expect(q({ productIds: ["growth-report"] }).marketY1).toBe(12 * 850);
  });
});

describe("formatZAR / whatsapp", () => {
  it("formats", () => {
    expect(formatZAR(14800)).toBe("R14,800");
    expect(formatZAR(-500)).toBe("-R500");
    expect(formatZAR(1234567)).toBe("R1,234,567");
  });
  it("whatsapp text", () => {
    const t = q({ packId: "vape-pro" });
    const s = quoteWhatsAppText("WR-2026-0142", t, "https://x.test/q/WR-2026-0142");
    expect(s).toContain("WR-2026-0142");
    expect(s).toContain("Year 1: R14,800");
    expect(s).toContain("https://x.test/q/WR-2026-0142");
  });
});
