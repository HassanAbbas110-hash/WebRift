// Page content derived from the catalogue. Pure: safe for client and server components.
import { cities, faq, packs, productById, type Category, type Pack } from "@/data/catalogue";
import { computeQuote, formatZAR } from "@/lib/quote";
import { PHONE_TEL, SITE_URL } from "@/lib/site";

export const CATEGORIES: { id: Category; label: string; blurb: string; icon: string }[] = [
  { id: "storefront", label: "Your online shop", blurb: "A fast storefront that sends complete orders to your WhatsApp.", icon: "M3 9l1.5-5h15L21 9M4 9h16v11H4zM9 20v-6h6v6" },
  { id: "found", label: "Get found on Google", blurb: "Maps, listings and profiles so nearby customers pick you first.", icon: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
  { id: "design", label: "Look the part", blurb: "Product photos, posters and templates that make you look established.", icon: "M4 7h3l2-3h6l2 3h3v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { id: "retention", label: "Bring customers back", blurb: "Loyalty cards, restock lists and review replies on autopilot.", icon: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" },
  { id: "reports", label: "Know your numbers", blurb: "A health check against 5 competitors and a monthly growth report.", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { id: "control", label: "Control the shop", blurb: "Stock, warranty and cash-up alerts straight to the owner's phone.", icon: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM9 12l2 2 4-4" },
];

/** Every public pack figure comes from here, so pages never hard-code prices. */
export function packFigures(packId: Pack["id"]) {
  const pack = packs.find((p) => p.id === packId)!;
  const t = computeQuote({ packId, productIds: [], extraIds: [], payment: "instalments" }, {});
  return {
    pack,
    setup: t.setup,
    monthly: t.monthly,
    year1: t.year1,
    youSave: t.saveVsMarket,
    instalment: t.instalment ?? 0,
    prepay: t.prepayTotal,
  };
}

export const packSetupRange = () => {
  const s = packs.map((p) => packFigures(p.id).setup);
  return `${formatZAR(Math.min(...s))} – ${formatZAR(Math.max(...s))}`;
};

export type QuizAnswers = { shop: "vape" | "other"; site: "none" | "basic" | "yes"; pain: "found" | "orders" | "repeat" | "control"; budget: "low" | "mid" | "high" };

/** "Which pack fits me?" → a pack id. */
export function quizResult(a: QuizAnswers): Pack["id"] {
  if (a.shop === "vape") {
    if (a.budget === "low") return "vape-starter";
    if (a.budget === "high" || a.pain === "control") return "vape-complete";
    return "vape-pro";
  }
  if (a.pain === "repeat" && a.site === "yes") return "repeat-combo";
  return a.budget === "low" ? "retail-starter" : "retail-online";
}

// WebRift vs other options: catalogue p.23. WebRift setup/check-up figures read live from the catalogue.
export const COMPARE_COLS = ["DIY builder", "Typical agency", "Freelancer", "WebRift"] as const;
export const compareRows = (): { label: string; cells: [string, string, string, string] }[] => [
  { label: "Setup cost", cells: ["Your own time", "R30,000 – R85,000", "R6,000 – R25,000", `${packSetupRange()} (packs)`] },
  { label: "Monthly cost", cells: ["About R580 (Shopify Basic, domain, hosting)", "R2,000 – R2,700 (maintenance)", "R500 and up (maintenance)", `From ${formatZAR(Math.min(...packs.map((p) => p.monthly)))}, with free edits`] },
  { label: "Time to launch", cells: ["Weeks of your time", "1 to 3 months", "2 to 6 weeks", "Days"] },
  { label: "Orders on WhatsApp", cells: ["Needs extra apps", "Rarely", "Sometimes", "Built in"] },
  { label: "Shop-specific tools (age gate, finders)", cells: ["You build or buy", "Rarely", "Rarely", "Built for vape shops"] },
  { label: "Google & review help", cells: ["You do it", "Extra service", "Extra service", "Maps, reviews, monthly report"] },
  { label: "Check-up vs competitors", cells: ["No", "Agency SEO audit R10,000 – R31,000", "Sometimes", `Health Check ${formatZAR(productById("health-check")!.setup)}`] },
];
export const RATINGS: { label: string; scores: [number, number, number, number] }[] = [
  { label: "Price", scores: [7, 3, 6, 9] },
  { label: "Speed", scores: [5, 4, 5, 9] },
  { label: "Vape fit", scores: [3, 3, 4, 9] },
  { label: "Support", scores: [3, 8, 5, 7] },
  { label: "Flexibility", scores: [8, 9, 7, 6] },
];
export const OVERALL: [number, number, number, number] = [5.2, 5.4, 5.4, 8.0];

const jsonLdFaq = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
const jsonLdBusiness = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "WebRift",
  url: SITE_URL,
  telephone: PHONE_TEL,
  priceRange: "R2,200–R11,000",
  areaServed: cities.map((name) => ({ "@type": "City", name })),
  address: { "@type": "PostalAddress", addressLocality: "Rustenburg", addressCountry: "ZA" },
});
export const jsonLd = { faq: jsonLdFaq, business: jsonLdBusiness };
