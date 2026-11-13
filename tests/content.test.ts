import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { faq } from "@/data/catalogue";
import { budgetOptions, jsonLd, packFigures, packSavingsCopy, quizResult, serializeJsonLd } from "@/lib/content";
import { formatZAR } from "@/lib/quote";
import { packs } from "@/data/catalogue";

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

  it("JSON-LD serialisation escapes </script>", () => {
    const out = serializeJsonLd({ a: "</script><b>" });
    expect(out).toContain("\\u003c/script>");
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).a).toBe("</script><b>");
  });

  it("LocalBusiness priceRange comes from the live pack setups", () => {
    const s = packs.map((p) => p.setup);
    expect(jsonLd.business().priceRange).toBe(`${formatZAR(Math.min(...s))}–${formatZAR(Math.max(...s))}`);
    expect(jsonLd.business().priceRange).toBe("R2,200–R11,000");
  });

  it("quiz budget labels track the vape pack setups", () => {
    expect(budgetOptions().map(([, l]) => l)).toEqual(["Under R7,000", "R7,000 – R11,000", "R11,000+"]);
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

  it("bought-separately figures sum the pack's products from the catalogue", () => {
    const sep = (id: Parameters<typeof packFigures>[0]) => {
      const f = packFigures(id);
      return [f.separatelySetup, f.separatelyMonthly, f.saveVsSeparately];
    };
    expect(sep("vape-starter")).toEqual([6750, 780, 6110]);
    expect(sep("vape-pro")).toEqual([14200, 1560, 18120]);
    expect(sep("vape-complete")).toEqual([18650, 2930, 33810]);
    for (const p of packs) {
      const f = packFigures(p.id);
      expect(f.separatelySetup + 12 * f.separatelyMonthly, p.id).toBe(p.separatelyY1);
    }
    expect(packSavingsCopy("vape-pro")).toEqual({
      setup: "Setup is R7,200 lower than buying the items one by one (51% off)",
      monthly: "Monthly is R910 lower",
    });
  });

  it("pack card and packs page use packFigures, never hard-coded figures", () => {
    for (const file of ["src/components/sections/PackCard.tsx", "src/app/(site)/packs/page.tsx", "src/components/sections/PackQuiz.tsx"]) {
      const src = readFileSync(file, "utf8");
      expect(src).toMatch(/packFigures\(|budgetOptions\(/);
      expect(src).not.toMatch(/R\d{1,3},\d{3}/);
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
