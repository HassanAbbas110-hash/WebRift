"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { products, type Category, type Product } from "@/data/catalogue";
import { CATEGORIES } from "@/lib/content";
import { formatZAR } from "@/lib/quote";

const chip = "rounded-full border px-4 py-2 text-sm font-medium transition";

/** Reads ?c= from the URL. Used inside Suspense; the fallback renders the full list for crawlers. */
export function ServicesFromUrl() {
  const c = useSearchParams().get("c");
  const initial = CATEGORIES.some((x) => x.id === c) ? (c as Category) : "all";
  return <ServicesCatalogue key={initial} initial={initial} />;
}

export function ServicesCatalogue({ initial = "all" }: { initial?: Category | "all" }) {
  const [cat, setCat] = useState(initial);
  const shown = cat === "all" ? products : products.filter((p) => p.category === cat);
  return (
    <>
      <div role="group" aria-label="Filter by category" className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap">
        {([["all", "All tools"], ...CATEGORIES.map((c) => [c.id, c.label])] as [Category | "all", string][]).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={cat === id}
            onClick={() => setCat(id)}
            className={`${chip} shrink-0 ${cat === id ? "border-cyan bg-cyan/10 text-text" : "border-line text-muted hover:text-text"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}

function ProductCard({ p }: { p: Product }) {
  const ours = p.monthlyOnly ? p.monthly : p.setup;
  const unit = p.monthlyOnly ? "/mo" : "";
  return (
    <article className="card flex flex-col p-6">
      <p className="text-xs font-semibold tracking-widest text-muted uppercase">{CATEGORIES.find((c) => c.id === p.category)?.label}</p>
      <h3 className="font-display mt-2 text-xl font-semibold">{p.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</p>
      <p className="mt-5">
        <span className="font-display text-2xl font-bold">{formatZAR(ours)}{unit}</span>
        {!p.monthlyOnly && <span className="ml-2 text-sm text-muted">{p.monthly ? `setup + ${formatZAR(p.monthly)}/mo` : "once-off"}</span>}
      </p>
      <details className="group mt-4 border-t border-line pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-cyan [&::-webkit-details-marker]:hidden">
          Why shops buy it &amp; what&apos;s included
          <span aria-hidden="true" className="transition group-open:rotate-180">⌄</span>
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-muted">{p.why}</p>
        <ul className="mt-3 space-y-1 text-sm">
          {p.includes.map((i) => <li key={i} className="flex gap-2"><span className="text-cyan">✓</span>{i}</li>)}
        </ul>
        <RangeBar low={p.market.low} avg={p.market.avg} high={p.market.high} ours={ours} unit={unit} />
        {p.note && <p className="mt-3 text-xs text-muted">{p.note}</p>}
      </details>
      <div className="mt-auto pt-6">
        <Link href={`/quote?p=${p.id}`} className="block rounded-full border border-line bg-white/5 px-5 py-2.5 text-center text-sm font-semibold transition hover:border-cyan/50">
          Add to quote +
        </Link>
      </div>
    </article>
  );
}

function RangeBar({ low, avg, high, ours, unit }: { low: number; avg: number; high: number; ours: number; unit: string }) {
  const min = Math.min(low, ours) * 0.85, max = high * 1.05;
  const at = (n: number) => `${((n - min) / (max - min)) * 100}%`;
  return (
    <figure className="mt-5">
      <figcaption className="text-xs text-muted">Typical market price{unit && " per month"} vs ours</figcaption>
      <div className="relative mt-7 mb-6 h-2 rounded-full bg-white/[0.06]">
        <div className="absolute inset-y-0 rounded-full bg-white/20" style={{ left: at(low), right: `calc(100% - ${at(high)})` }} />
        <div className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-white/50" style={{ left: at(avg) }} />
        <div className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" style={{ left: at(ours) }}>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-cyan">Ours {formatZAR(ours)}</span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted tabular-nums">
        <span>Low {formatZAR(low)}</span><span>Avg {formatZAR(avg)}</span><span>High {formatZAR(high)}</span>
      </div>
    </figure>
  );
}
