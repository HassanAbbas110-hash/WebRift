// Pure quote maths (no I/O, no Date.now). Client previews and the server's save both use this.
import { extras, packs, productById, type Pack } from "@/data/catalogue";

export type Payment = "standard" | "instalments" | "prepay";
export type QuoteInput = {
  packId?: Pack["id"];
  productIds: string[];
  extraIds: string[];
  payment: Payment;
  setupDiscount?: number;
  customLines?: { label: string; setup: number; monthly: number }[];
};
export type QuoteLine = {
  kind: "pack" | "product" | "extra" | "custom" | "discount";
  id?: string;
  label: string;
  setup: number;
  monthly: number;
  included?: boolean;
};
export type QuoteTotals = {
  lines: QuoteLine[];
  setup: number;
  monthly: number;
  /** setup + 12 × monthly, whatever the payment choice. */
  year1: number;
  prepayTotal: number;
  /** What year 1 actually costs with the chosen payment: prepayTotal when prepaying, else year1. */
  effectiveYear1: number;
  /** Due to start: deposit/first instalment + first month; prepay pays 50% of setup + the 10 months up front. */
  dueNow: number;
  instalment: number | null;
  deposit: number;
  marketY1: number;
  saveVsMarket: number;
  bonuses: { label: string; worth: number }[];
  payment: Payment;
  discountApplied: number;
};

const pos = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export function computeQuote(input: QuoteInput, floors: Partial<Record<Pack["id"], number>>): QuoteTotals {
  const pack = packs.find((p) => p.id === input.packId);
  const lines: QuoteLine[] = [];
  let marketY1 = 0;

  if (pack) {
    lines.push({ kind: "pack", id: pack.id, label: pack.name, setup: pack.setup, monthly: pack.monthly });
    marketY1 += pack.marketY1;
  }
  for (const id of new Set(input.productIds)) {
    const p = productById(id);
    if (!p) continue;
    if (pack?.productIds.includes(id)) {
      lines.push({ kind: "product", id, label: p.name, setup: 0, monthly: 0, included: true });
      continue;
    }
    lines.push({ kind: "product", id, label: p.name, setup: p.setup, monthly: p.monthly });
    marketY1 += p.monthlyOnly ? 12 * p.market.avg : p.market.avg + 12 * (p.marketMonthly?.avg ?? p.monthly);
  }
  for (const id of new Set(input.extraIds)) {
    const e = extras.find((x) => x.id === id);
    if (!e) continue;
    lines.push({ kind: "extra", id, label: e.name, setup: e.setup, monthly: e.monthly });
    marketY1 += e.avg;
  }
  for (const c of input.customLines ?? []) {
    const setup = pos(c.setup), monthly = pos(c.monthly);
    lines.push({ kind: "custom", label: c.label, setup, monthly });
    marketY1 += setup + 12 * monthly;
  }

  const floor = pack ? floors[pack.id] : undefined;
  const discountApplied =
    pack && floor !== undefined ? Math.max(0, Math.min(Math.floor(pos(input.setupDiscount ?? 0)), pack.setup - floor)) : 0;
  if (discountApplied > 0) {
    lines.push({ kind: "discount", label: "Negotiated discount", setup: -discountApplied, monthly: 0 });
  }

  const setup = lines.reduce((s, l) => s + l.setup, 0);
  const monthly = lines.reduce((s, l) => s + l.monthly, 0);
  const year1 = setup + 12 * monthly;
  const payment: Payment = input.payment === "instalments" && !pack ? "standard" : input.payment;
  const instalment = payment === "instalments" ? Math.ceil(setup / 3) : null;
  const prepayTotal = setup + 10 * monthly;
  const effectiveYear1 = payment === "prepay" ? prepayTotal : year1;
  const deposit = instalment ?? Math.round(setup * 0.5);

  return {
    lines, setup, monthly, year1,
    prepayTotal, effectiveYear1,
    dueNow: deposit + (payment === "prepay" ? 10 : 1) * monthly,
    instalment,
    deposit,
    marketY1,
    saveVsMarket: Math.max(0, marketY1 - effectiveYear1),
    bonuses: pack?.bonuses ?? [],
    payment,
    discountApplied,
  };
}

// Manual grouping: Intl's en-ZA output uses spaces.
export function formatZAR(n: number): string {
  const s = Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}R${s}`;
}

export const year1Label = (t: QuoteTotals) => (t.payment === "prepay" ? "Year 1 (prepaid)" : "Year 1");

export const paymentLine = (t: QuoteTotals) =>
  t.payment === "instalments" ? `3 instalments of ${formatZAR(t.instalment ?? 0)}`
  : t.payment === "prepay" ? `Year 1 with prepay: ${formatZAR(t.prepayTotal)} (setup + 10 months, 2 months free)`
  : `50% deposit to start: ${formatZAR(t.deposit)}`;

export function quoteWhatsAppText(id: string, t: QuoteTotals, url: string): string {
  const out = [`WebRift quote ${id}`];
  for (const l of t.lines) {
    if (l.included) continue;
    const parts = [l.setup && `${formatZAR(l.setup)} once-off`, l.monthly && `${formatZAR(l.monthly)}/mo`].filter(Boolean);
    out.push(`• ${l.label}: ${parts.join(" + ") || formatZAR(0)}`);
  }
  out.push(`Once-off: ${formatZAR(t.setup)}`, `Monthly: ${formatZAR(t.monthly)}`, `${year1Label(t)}: ${formatZAR(t.effectiveYear1)}`);
  out.push(`Payment: ${paymentLine(t)}`, `Due to start: ${formatZAR(t.dueNow)}`);
  out.push("Estimate only, excl. VAT. Prices may change.", url);
  return out.join("\n");
}

/** validUntil is a Johannesburg calendar date (YYYY-MM-DD); the quote holds until that day ends there. */
export function quoteStatus(validUntil: string, now: Date): "valid" | "expired" {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(now);
  return today > validUntil ? "expired" : "valid";
}
