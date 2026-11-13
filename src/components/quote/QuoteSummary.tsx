"use client";

import { useMotionMode } from "@/components/fx/motion-store";
import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatZAR, paymentLine, year1Label, type QuoteTotals } from "@/lib/quote";

/** Counts from the last shown value to the new one; jumps straight there under reduced motion. */
function Num({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const { mode } = useMotionMode();
  const reduce = mode === "lite";
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) { el.textContent = formatZAR(value); shown.current = value; return; }
    const c = animate(shown.current, value, {
      duration: 0.45, ease: "easeOut",
      onUpdate: (v) => { shown.current = v; el.textContent = formatZAR(v); },
    });
    return () => c.stop();
  }, [value, reduce]);
  return <span ref={ref} className="tabular-nums">{formatZAR(value)}</span>;
}

type Props = { totals: QuoteTotals; saving: boolean; canSave: boolean };

export function QuoteSummary({ totals: t, saving, canSave }: Props) {
  const [open, setOpen] = useState(false);
  const priced = t.lines.filter((l) => !l.included);
  const included = t.lines.length - priced.length;

  const details = (
    <>
      {priced.length === 0 ? (
        <p className="text-sm text-muted">Pick a pack or a few products to see your price.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {priced.map((l, i) => (
            <li key={`${l.kind}-${l.id ?? i}`} className="flex justify-between gap-3">
              <span className={l.kind === "discount" ? "text-cyan" : "text-text"}>{l.label}</span>
              <span className="shrink-0 text-right text-muted tabular-nums">
                {formatZAR(l.setup)}{l.monthly ? ` + ${formatZAR(l.monthly)}/mo` : ""}
              </span>
            </li>
          ))}
          {included > 0 && <li className="text-xs text-muted">Includes {included} products</li>}
        </ul>
      )}
      {t.bonuses.length > 0 && (
        <p className="mt-4 rounded-xl border border-cyan/20 bg-cyan/5 px-3 py-2 text-xs text-cyan">
          Free: {t.bonuses.map((b) => b.label).join(", ")}
        </p>
      )}
    </>
  );

  const totals = (
    <dl className="grid grid-cols-3 gap-2 text-center">
      {([["Once-off", t.setup], ["Monthly", t.monthly], [year1Label(t), t.effectiveYear1]] as const).map(([k, v]) => (
        <div key={k} className="rounded-xl bg-white/5 px-2 py-2.5">
          <dt className="text-[11px] tracking-wide text-muted uppercase">{k}</dt>
          <dd className="font-display mt-0.5 text-base font-semibold sm:text-lg"><Num value={v} /></dd>
        </div>
      ))}
    </dl>
  );

  const extra = priced.length > 0 && (
    <div className="space-y-1 text-sm">
      <p className="text-text">{paymentLine(t)}</p>
      <p className="text-text">Due to start: <Num value={t.dueNow} /></p>
      {t.saveVsMarket > 0 && <p className="text-cyan">Save <Num value={t.saveVsMarket} /> vs typical market prices in year 1</p>}
      <p className="text-xs text-muted">Estimate only. ZAR, excluding VAT.</p>
    </div>
  );

  const save = (
    <button
      type="submit" form="quote-form" disabled={!canSave || saving}
      className="bg-grad w-full rounded-full px-6 py-3 font-semibold text-white shadow-[0_0_30px_-6px_rgba(59,130,246,0.8)] transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
    >
      {saving ? "Saving…" : "Save my quote"}
    </button>
  );

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {priced.length ? `Once-off ${formatZAR(t.setup)}, monthly ${formatZAR(t.monthly)}, ${year1Label(t).toLowerCase()} ${formatZAR(t.effectiveYear1)}.` : ""}
      </p>

      {/* Desktop: sticky side panel */}
      <aside aria-label="Quote summary" className="hidden lg:block">
        <div className="sticky top-24 space-y-5 rounded-3xl border border-line bg-panel/70 p-6 shadow-[0_30px_80px_-30px_rgba(59,130,246,0.45)]">
          <h2 className="font-display text-lg font-semibold">Your quote</h2>
          {totals}
          {extra}
          <div className="border-t border-line pt-4">{details}</div>
          {save}
        </div>
      </aside>

      {/* Mobile: bottom sheet */}
      <div data-sheet className="fixed bg-bg/95 backdrop-blur-xl inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-line px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)] lg:hidden">
        <button
          type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="sheet-details"
          className="mx-auto mb-3 flex items-center gap-2 text-xs text-muted"
        >
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-white/20" />
          {open ? "Hide details" : "Show details"}
        </button>
        {open && <div id="sheet-details" className="mb-4 max-h-[45svh] space-y-4 overflow-y-auto">{extra}{details}</div>}
        {totals}
        <div className="mt-3">{save}</div>
      </div>
    </>
  );
}
