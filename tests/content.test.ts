import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { faq } from "@/data/catalogue";
import { jsonLd, packFigures, quizResult } from "@/lib/content";

describe("site content", () => {
  it("sitemap lists every public page", () => {
    const paths = sitemap().map((e) => new URL(e.url).pathname);
    for (const p of ["/", "/services", "/packs", "/quote", "/health-check", "/about", "/contact", "/privacy"]) {
      expect(paths).toContain(p);
    }
  });

  it("FAQPage JSON-LD has one entry per catalogue FAQ", () => {
    const ld = jsonLd.faq();
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(faq.length);
    expect(ld.mainEntity[0].name).toBe(faq[0].q);
  });

  it("LocalBusiness JSON-LD serves the 8 cities", () => {
    const ld = jsonLd.business();
    expect(ld.telephone).toBe("+27817179974");
    expect(ld.areaServed).toHaveLength(8);
  });

  it("pack figures come from computeQuote", () => {
    const f = packFigures("vape-pro");
    expect(f.year1).toBe(14800);
    expect(f.instalment).toBe(Math.ceil(7000 / 3));
    expect(f.prepay).toBe(7000 + 10 * 650);
    expect(f.youSave).toBe(55650 - 14800);
  });

  it("pack card and packs page use packFigures, never hard-coded figures", () => {
    for (const file of ["src/components/sections/PackCard.tsx", "src/app/(site)/packs/page.tsx"]) {
      const src = readFileSync(file, "utf8");
      expect(src).toContain("packFigures(");
      expect(src).not.toMatch(/14,?800/);
    }
  });

  it("quiz maps answers to sensible packs", () => {
    expect(quizResult({ shop: "vape", site: "none", pain: "orders", budget: "mid" })).toBe("vape-pro");
    expect(quizResult({ shop: "vape", site: "none", pain: "found", budget: "low" })).toBe("vape-starter");
    expect(quizResult({ shop: "vape", site: "yes", pain: "control", budget: "mid" })).toBe("vape-complete");
    expect(quizResult({ shop: "other", site: "yes", pain: "repeat", budget: "mid" })).toBe("repeat-combo");
    expect(quizResult({ shop: "other", site: "none", pain: "found", budget: "low" })).toBe("retail-starter");
  });
});
