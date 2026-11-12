"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";

// Catalogue p.22: example data for a fictional shop.
const SCORE = 5.8;
const METRICS: { label: string; shop: number; avg: number; max: number; fmt?: (n: number) => string }[] = [
  { label: "Google rating", shop: 4.1, avg: 4.5, max: 5, fmt: (n) => n.toFixed(1) },
  { label: "Google reviews", shop: 38, avg: 210, max: 250 },
  { label: "Owner replies to reviews", shop: 10, avg: 70, max: 100, fmt: (n) => `${n}%` },
  { label: "Photos on the profile", shop: 6, avg: 45, max: 50 },
  { label: "Instagram posts, last 30 days", shop: 1, avg: 12, max: 15 },
];
const YESNO: [string, string, string][] = [["Website that takes orders", "No", "Yes"], ["Opening hours complete", "Partly", "Yes"]];
const ACTIONS = [
  ["Get more reviews", "Put a QR stand at the till and message happy customers a review link. Aim for 100 reviews in 6 months."],
  ["Reply to every review", "AI-drafted replies, posted within a day. Competitors reply to 7 in 10."],
  ["Launch an order page", "A storefront or price-list page with a WhatsApp order button. 4 of 5 competitors already have one."],
];
const ease = [0.22, 1, 0.36, 1] as const;

export function SampleReport() {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className="card overflow-hidden">
          <div className="flex flex-col items-center gap-6 border-b border-line bg-white/[0.02] p-6 sm:flex-row sm:p-8">
            <div className="relative size-36 shrink-0">
              <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
                <defs>
                  <linearGradient id="hc-gauge" x1="0" x2="1"><stop offset="0" stopColor="var(--cyan)" /><stop offset="1" stopColor="var(--violet)" /></linearGradient>
                </defs>
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="10" />
                <m.circle
                  cx="60" cy="60" r={r} fill="none" stroke="url(#hc-gauge)" strokeWidth="10" strokeLinecap="round" strokeDasharray={c}
                  initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - SCORE / 10) }} viewport={{ once: true }}
                  transition={{ duration: 1.4, ease }}
                />
              </svg>
              <p className="absolute inset-0 grid place-items-center text-center">
                <span><span className="font-display text-4xl font-bold">{SCORE}</span><span className="block text-xs text-muted">out of 10</span></span>
              </p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold tracking-widest text-muted uppercase">Sample report · fictional shop</p>
              <h3 className="font-display mt-1 text-2xl font-bold">Example Shop, compared with 5 nearby competitors</h3>
              <p className="mt-2 text-muted">Good bones, but customers can&apos;t see enough: few reviews, no replies, and no website to take orders.</p>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
            <div>
              <h4 className="font-display font-semibold">How the shop compares</h4>
              <p className="mt-1 flex gap-4 text-xs text-muted">
                <span><span className="mr-1.5 inline-block size-2 rounded-full bg-cyan" />This shop</span>
                <span><span className="mr-1.5 inline-block size-2 rounded-full bg-white/30" />Average of 5 competitors</span>
              </p>
              <ul className="mt-5 space-y-4">
                {METRICS.map((x, i) => (
                  <li key={x.label} className="text-sm">
                    <p className="flex justify-between"><span>{x.label}</span><span className="tabular-nums text-muted"><span className="text-cyan">{(x.fmt ?? String)(x.shop)}</span> vs {(x.fmt ?? String)(x.avg)}</span></p>
                    {[[x.shop, "bg-cyan"], [x.avg, "bg-white/30"]].map(([v, cls], j) => (
                      <span key={j} className="mt-1 block h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <m.span
                          className={`block h-full origin-left rounded-full ${cls}`} style={{ width: `${(Number(v) / x.max) * 100}%` }}
                          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.08, ease }}
                        />
                      </span>
                    ))}
                  </li>
                ))}
                {YESNO.map(([l, shop, avg]) => (
                  <li key={l} className="flex justify-between text-sm"><span>{l}</span><span><span className="text-cyan">{shop}</span> <span className="text-muted">vs {avg}</span></span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold">Top 3 actions, in order</h4>
              <ol className="mt-5 space-y-4">
                {ACTIONS.map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="bg-grad grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white">{i + 1}</span>
                    <span><strong className="block">{t}</strong><span className="text-sm text-muted">{d}</span></span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
