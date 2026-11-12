"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { extras, packs, productById, products, type Category, type Pack } from "@/data/catalogue";
import { computeQuote, formatZAR, type Payment, type QuoteInput } from "@/lib/quote";
import { QuoteSummary } from "./QuoteSummary";

type Floors = Partial<Record<Pack["id"], number>>;
type Custom = NonNullable<QuoteInput["customLines"]>[number];

const GROUPS: [Category, string][] = [
  ["storefront", "Your online shop"], ["found", "Get found"], ["design", "Look the part"],
  ["retention", "Bring customers back"], ["reports", "Know your numbers"], ["control", "Control the shop"],
];
const PAYS: { id: Payment; label: string }[] = [
  { id: "standard", label: "50% deposit, balance on delivery" },
  { id: "instalments", label: "Setup in 3 instalments (packs only)" },
  { id: "prepay", label: "Prepay 12 months, get 2 months free" },
];
const MARKETER_KEY = "wr_marketer";
const price = (setup: number, monthly: number) =>
  [setup && formatZAR(setup), monthly && `${formatZAR(monthly)}/mo`].filter(Boolean).join(" + ") || "R0";
const n = (s: string | null | undefined, max = 1e6) => Math.min(max, Math.max(0, Math.floor(Number(s)) || 0));

/** URL → builder state. Unknown ids and junk values are dropped, never trusted. */
function parse(sp: URLSearchParams) {
  const list = (k: string) => [...new Set((sp.get(k) ?? "").split(",").filter(Boolean))];
  const pack = packs.find((p) => p.id === sp.get("pack"));
  const custom: Custom[] = sp.getAll("c").slice(0, 10).map((s) => {
    const [a, b, ...rest] = s.split(":");
    return { label: rest.join(":").trim().slice(0, 80), setup: n(a), monthly: n(b) };
  }).filter((c) => c.label);
  return {
    pack,
    picked: list("p").filter((id) => productById(id)),
    extraIds: list("x").filter((id) => extras.some((e) => e.id === id)),
    payment: PAYS.find((p) => p.id === sp.get("pay"))?.id ?? "standard",
    discount: n(sp.get("d"), 100000),
    custom,
  };
}

const card = "flex cursor-pointer gap-3 rounded-2xl border border-line bg-white/[0.03] p-4 transition hover:border-cyan/40 has-[:checked]:border-cyan has-[:checked]:bg-cyan/[0.07] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan";
const field = "mt-1 block w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-text placeholder:text-muted/60 focus:border-cyan focus:outline-none";
const legend = "font-display mb-4 text-xl font-semibold";
const stepNo = (i: number) => <span className="text-grad mr-2">{i}.</span>;

export function QuoteBuilder() {
  const sp = useSearchParams();
  const router = useRouter(); // only for the post-save navigation
  const pathname = usePathname();
  const s = useMemo(() => parse(new URLSearchParams(sp.toString())), [sp]);

  const [floors, setFloors] = useState<Floors | null>(null); // non-null only in sales mode
  const [client, setClient] = useState({ name: "", phone: "", shop: "", consent: false });
  const [marketer, setMarketer] = useState(() => (typeof window === "undefined" ? "" : localStorage.getItem(MARKETER_KEY) ?? ""));
  const [draft, setDraft] = useState({ label: "", setup: "", monthly: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth").then((r) => r.json()).then((d) => d.role && setFloors(d.floors ?? {})).catch(() => {});
  }, []);

  const sales = floors !== null;
  const floor = s.pack && floors ? floors[s.pack.id] : undefined;
  const maxDiscount = s.pack && floor !== undefined ? Math.max(0, s.pack.setup - floor) : 0;
  const input: QuoteInput = {
    packId: s.pack?.id,
    productIds: [...new Set([...(s.pack?.productIds ?? []), ...s.picked])],
    extraIds: s.extraIds,
    payment: s.payment,
    ...(sales && { setupDiscount: s.discount, customLines: s.custom }),
  };
  const totals = computeQuote(input, floors ?? {});
  const empty = totals.lines.length === 0;

  // Handlers read the live URL, not the last render, so quick taps never build on stale state.
  const live = () => new URLSearchParams(window.location.search);
  const set = (patch: Record<string, string | string[] | null>) => {
    const next = live();
    for (const [k, v] of Object.entries(patch)) {
      next.delete(k);
      if (Array.isArray(v)) v.forEach((x) => next.append(k, x));
      else if (v) next.set(k, v);
    }
    // Native replaceState: Next syncs useSearchParams instantly with no server round trip (router.replace refetched RSC on every tap, ~0.5s).
    window.history.replaceState(null, "", `${pathname}?${next}`);
  };
  const toggle = (k: "p" | "x", id: string, on: boolean) => {
    const cur = (live().get(k) ?? "").split(",").filter((x) => x && x !== id);
    set({ [k]: (on ? [...cur, id] : cur).join(",") });
  };
  const setCustom = (f: (c: Custom[]) => Custom[]) => set({ c: f(parse(live()).custom).map((x) => `${x.setup}:${x.monthly}:${x.label}`) });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (empty) return setError("Add a pack or at least one product first.");
    const hasDetails = !!(client.name.trim() || client.phone.trim() || client.shop.trim());
    if (hasDetails && (!client.name.trim() || !client.phone.trim())) return setError("Add both your name and number, or leave your details blank.");
    if (hasDetails && !client.consent) return setError("Please tick the consent box so we can store your details.");
    setSaving(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, client: hasDetails ? client : undefined, marketer: sales && marketer.trim() ? marketer.trim() : undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error();
      router.push(data.url);
    } catch {
      setError("We couldn't save your quote. Check your details and try again.");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-10 pb-48 lg:grid-cols-[1fr_22rem] lg:pb-0">
      <form id="quote-form" onSubmit={save} noValidate className="min-w-0 space-y-12">
        <fieldset>
          <legend className={legend}>{stepNo(1)}Choose a pack</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {packs.map((p) => (
              <label key={p.id} className={card}>
                <input type="radio" name="pack" value={p.id} checked={s.pack?.id === p.id} onChange={() => set({ pack: p.id })} className="mt-1 accent-cyan" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{p.name}</span>
                    {p.popular && <span className="bg-grad rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">Most popular</span>}
                  </span>
                  <span className="mt-0.5 block text-xs tracking-wide text-muted">{p.audience} · {p.tagline}</span>
                  <span className="mt-2 block text-sm tabular-nums">{formatZAR(p.setup)} once-off + {formatZAR(p.monthly)}/mo</span>
                </span>
              </label>
            ))}
            <label className={`${card} sm:col-span-2`}>
              <input type="radio" name="pack" value="" checked={!s.pack} onChange={() => set({ pack: null })} className="mt-1 accent-cyan" />
              <span><span className="font-semibold">Build my own</span><span className="block text-sm text-muted">Pick individual products below.</span></span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className={legend}>{stepNo(2)}Add products and extras</legend>
          <div className="space-y-6">
            {GROUPS.map(([cat, title]) => (
              <div key={cat}>
                <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">{title}</h3>
                <ul className="divide-y divide-line rounded-2xl border border-line bg-white/[0.02]">
                  {products.filter((p) => p.category === cat).map((p) => {
                    const inPack = !!s.pack?.productIds.includes(p.id);
                    return (
                      <li key={p.id}>
                        <label className={`flex items-center gap-3 px-4 py-3 ${inPack ? "" : "cursor-pointer hover:bg-white/[0.03]"}`}>
                          <input type="checkbox" checked={inPack || s.picked.includes(p.id)} disabled={inPack}
                            onChange={(e) => toggle("p", p.id, e.target.checked)} className="size-4 accent-cyan" />
                          <span className="min-w-0 flex-1 text-sm">{p.name}</span>
                          {inPack
                            ? <span className="rounded-full bg-cyan/10 px-2 py-0.5 text-xs text-cyan">Included</span>
                            : <span className="shrink-0 text-xs text-muted tabular-nums">{price(p.setup, p.monthly)}</span>}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted uppercase">Extras</h3>
              <ul className="divide-y divide-line rounded-2xl border border-line bg-white/[0.02]">
                {extras.map((x) => (
                  <li key={x.id}>
                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-white/[0.03]">
                      <input type="checkbox" checked={s.extraIds.includes(x.id)} onChange={(e) => toggle("x", x.id, e.target.checked)} className="size-4 accent-cyan" />
                      <span className="min-w-0 flex-1 text-sm">{x.name}<span className="block text-xs text-muted">{x.bestFor}</span></span>
                      <span className="shrink-0 text-xs text-muted tabular-nums">{price(x.setup, x.monthly)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className={legend}>{stepNo(3)}How would you like to pay?</legend>
          <div className="grid gap-3">
            {PAYS.map((p) => {
              const off = p.id === "instalments" && !s.pack;
              return (
                <label key={p.id} className={`${card} ${off ? "pointer-events-none opacity-40" : ""}`}>
                  <input type="radio" name="pay" value={p.id} disabled={off} checked={totals.payment === p.id} onChange={() => set({ pay: p.id === "standard" ? null : p.id })} className="mt-1 accent-cyan" />
                  <span className="text-sm">{p.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {sales && (
          <fieldset className="rounded-3xl border border-violet/40 bg-violet/[0.06] p-5">
            <legend className="px-2 text-sm font-semibold text-violet-300">Sales mode</legend>
            <label className="block text-sm">Marketer name
              <input value={marketer} maxLength={40} onChange={(e) => { setMarketer(e.target.value); try { localStorage.setItem(MARKETER_KEY, e.target.value); } catch {} }} className={field} />
            </label>
            {maxDiscount > 0 && (
              <label className="mt-4 block text-sm">Negotiated price: {formatZAR((s.pack?.setup ?? 0) - Math.min(s.discount, maxDiscount))} setup
                <input type="range" min={0} max={maxDiscount} step={50} value={Math.min(s.discount, maxDiscount)}
                  onChange={(e) => set({ d: e.target.value === "0" ? null : e.target.value })} className="mt-2 block w-full accent-cyan" />
              </label>
            )}
            <div className="mt-4 space-y-2">
              <p className="text-sm">Custom lines</p>
              {s.custom.map((c, i) => (
                <p key={i} className="flex items-center justify-between gap-2 text-sm">
                  <span>{c.label} · {price(c.setup, c.monthly)}</span>
                  <button type="button" aria-label={`Remove ${c.label}`} onClick={() => setCustom((c) => c.filter((_, j) => j !== i))} className="text-muted hover:text-cyan">Remove</button>
                </p>
              ))}
              <div className="grid grid-cols-[1fr_5.5rem_5.5rem_auto] items-end gap-2">
                <input aria-label="Custom line label" placeholder="Label" maxLength={80} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className={field} />
                <input aria-label="Custom line setup (R)" placeholder="Setup" inputMode="numeric" value={draft.setup} onChange={(e) => setDraft({ ...draft, setup: e.target.value })} className={field} />
                <input aria-label="Custom line monthly (R)" placeholder="/mo" inputMode="numeric" value={draft.monthly} onChange={(e) => setDraft({ ...draft, monthly: e.target.value })} className={field} />
                <button type="button" disabled={!draft.label.trim() || s.custom.length >= 10}
                  onClick={() => { setCustom((c) => [...c, { label: draft.label.trim(), setup: n(draft.setup), monthly: n(draft.monthly) }]); setDraft({ label: "", setup: "", monthly: "" }); }}
                  className="rounded-xl border border-line px-3 py-2.5 text-sm hover:border-cyan disabled:opacity-40">Add</button>
              </div>
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className={legend}>{stepNo(4)}Your details <span className="text-base font-normal text-muted">(optional)</span></legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Your name<input autoComplete="name" maxLength={80} value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className={field} /></label>
            <label className="block text-sm">WhatsApp number<input type="tel" autoComplete="tel" maxLength={20} value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} className={field} /></label>
            <label className="block text-sm sm:col-span-2">Shop name<input autoComplete="organization" maxLength={80} value={client.shop} onChange={(e) => setClient({ ...client, shop: e.target.value })} className={field} /></label>
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-muted">
            <input type="checkbox" checked={client.consent} onChange={(e) => setClient({ ...client, consent: e.target.checked })} className="mt-0.5 size-4 accent-cyan" />
            <span>I agree that WebRift may store my name and number to follow up on this quote. See our <Link href="/privacy" className="text-cyan underline">privacy policy</Link>.</span>
          </label>
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          <button type="submit" disabled={saving} className="bg-grad mt-6 hidden rounded-full px-8 py-3 font-semibold text-white disabled:opacity-40 lg:inline-block">
            {saving ? "Saving…" : "Save my quote"}
          </button>
        </fieldset>
      </form>

      <QuoteSummary totals={totals} saving={saving} canSave={!empty} />
    </div>
  );
}
