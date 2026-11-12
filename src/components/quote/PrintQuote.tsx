"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/brand/Logo";
import { terms } from "@/data/catalogue";
import { formatZAR, quoteWhatsAppText, type QuoteTotals } from "@/lib/quote";
import { waLink } from "@/lib/site";
import { lineLabel, paymentLine } from "./QuoteSummary";

type Props = {
  id: string; date: string; validUntil: string; shop: string | null;
  totals: QuoteTotals; expired: boolean;
};

const noop = () => () => {};
const btn = "rounded-full border border-line bg-white/5 px-5 py-2.5 text-sm font-semibold transition hover:border-cyan";

export function PrintQuote({ id, date, validUntil, shop, totals: t, expired }: Props) {
  const origin = useSyncExternalStore(noop, () => location.origin, () => "");
  const [copied, setCopied] = useState(false);
  const url = `${origin}/q/${id}`;
  const rows: [string, number][] = [["Once-off setup", t.setup], ["Monthly", t.monthly], ["Year 1 total", t.year1]];

  return (
    <article className="quote-doc mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {expired && (
        <div role="status" className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-200">
          This quote expired on {validUntil}. Prices may have changed. <Link href="/quote" className="underline">Build a fresh quote</Link>.
        </div>
      )}

      <div className="rounded-3xl border border-line bg-panel/60 p-6 sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <span className="text-lg print:hidden"><Logo /></span>
          <span className="hidden text-lg print:block"><Logo variant="mono" /></span>
          <dl className="text-right text-sm">
            <dt className="sr-only">Quote</dt><dd className="font-display text-lg font-semibold">{id}</dd>
            <dt className="inline text-muted">Date: </dt><dd className="inline">{date}</dd><br />
            <dt className="inline text-muted">Valid until: </dt><dd className="inline">{validUntil}</dd>
          </dl>
        </header>
        {shop && <p className="mt-6 text-sm text-muted">Prepared for <span className="font-semibold text-text">{shop}</span></p>}

        <table className="mt-6 w-full text-sm">
          <thead className="text-left text-xs tracking-wide whitespace-nowrap text-muted uppercase">
            <tr><th className="pb-2 font-medium">Item</th><th className="pb-2 text-right font-medium">Once-off</th><th className="pb-2 text-right font-medium">Monthly</th></tr>
          </thead>
          <tbody className="tabular-nums">
            {t.lines.map((l, i) => (
              <tr key={i} className="border-t border-line">
                <td className={`py-2 ${l.included ? "pl-4 text-muted" : ""}`}>{lineLabel(l)}</td>
                <td className="py-2 text-right">{l.included ? "Included" : formatZAR(l.setup)}</td>
                <td className="py-2 text-right">{l.included ? "" : l.monthly ? formatZAR(l.monthly) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {rows.map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-line p-3">
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="font-display mt-1 text-xl font-semibold tabular-nums">{formatZAR(v)}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-6 text-sm">
          <h2 className="font-semibold">Payment plan</h2>
          <p className="mt-1">{paymentLine(t)}</p>
          {t.saveVsMarket > 0 && <p className="mt-1 text-muted">You save {formatZAR(t.saveVsMarket)} vs typical market prices in year 1.</p>}
        </section>

        {t.bonuses.length > 0 && (
          <section className="mt-5 text-sm">
            <h2 className="font-semibold">Free bonuses</h2>
            <ul className="mt-1 list-disc pl-5">{t.bonuses.map((b) => <li key={b.label}>{b.label} (worth {formatZAR(b.worth)})</li>)}</ul>
          </section>
        )}

        <section className="mt-5 text-xs text-muted">
          <h2 className="text-sm font-semibold text-text">Terms</h2>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">{terms.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>

        <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
          Estimate only. Prices in ZAR, excluding VAT and third-party costs. Prices may change; this quote is valid until {validUntil}. Final price confirmed on order.
        </p>
        <p className="mt-2 hidden text-xs print:block">WebRift · WhatsApp 060 965 8641 · Phone 081 717 9974</p>
      </div>

      <div data-no-print className="mt-6 flex flex-wrap gap-3">
        {!expired && (
          <a href={waLink(`Hi WebRift, I want to go ahead with quote ${id}.`)} target="_blank" rel="noopener noreferrer"
            className="bg-grad rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-6px_rgba(59,130,246,0.8)]">
            I want to go ahead
          </a>
        )}
        <button type="button" onClick={() => window.print()} className={btn}>Print</button>
        <a href={`https://wa.me/?text=${encodeURIComponent(quoteWhatsAppText(id, t, url))}`} target="_blank" rel="noopener noreferrer" className={btn}>
          Send on WhatsApp
        </a>
        <button type="button" className={btn} onClick={() => navigator.clipboard?.writeText(url).then(() => setCopied(true), () => {})}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        <span aria-live="polite" className="sr-only">{copied ? "Link copied" : ""}</span>
      </div>
    </article>
  );
}
