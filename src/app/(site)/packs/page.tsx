import type { Metadata } from "next";
import { packs, products } from "@/data/catalogue";
import { CtaSection } from "@/components/sections/CtaSection";
import { NegotiableNote, PackCard } from "@/components/sections/PackCard";
import { packFigures } from "@/lib/content";
import { formatZAR } from "@/lib/quote";

export const metadata: Metadata = {
  title: "Packs",
  description: "Six WebRift packs for local shops: three made for vape stores, two for any shop and an add-on combo. Low setup, one monthly plan, setup in 3 instalments.",
  alternates: { canonical: "/packs" },
};

const th = "p-3 font-medium whitespace-nowrap";

export default function PacksPage() {
  const inAny = products.filter((p) => packs.some((k) => k.productIds.includes(p.id)));
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">Packs</p>
          <h1 className="font-display mt-3 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
            Bundle it. <span className="text-grad">Save thousands.</span>
          </h1>
          <p className="mt-5 text-lg text-muted">
            Low setup and one monthly plan with hosting, support and up to 5 free edits a month. Pay setup in 3 instalments, or prepay the year and get 2 months free.
          </p>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packs.map((p) => <PackCard key={p.id} id={p.id} detailed />)}
        </div>
        <NegotiableNote />

        <section className="mt-24">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Compare the packs</h2>
          <div className="card relative mt-6 overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={`${th} text-left`}>What&apos;s included</th>
                  {packs.map((p) => <th key={p.id} scope="col" className={`${th} ${p.popular ? "text-cyan" : ""}`}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {inAny.map((prod) => (
                  <tr key={prod.id} className="border-b border-line">
                    <th scope="row" className="p-3 text-left font-normal text-muted">{prod.name}</th>
                    {packs.map((p) => (
                      <td key={p.id} className={`p-3 text-center ${p.popular ? "bg-cyan/[0.05]" : ""}`}>
                        {p.productIds.includes(prod.id) ? <span className="text-cyan">✓<span className="sr-only">Included</span></span> : <span className="text-muted/40">–<span className="sr-only">Not included</span></span>}
                      </td>
                    ))}
                  </tr>
                ))}
                {(["setup", "monthly", "year1"] as const).map((k) => (
                  <tr key={k} className="border-b border-line last:border-0">
                    <th scope="row" className="p-3 text-left font-semibold">{k === "year1" ? "Year 1 total" : k === "setup" ? "Setup" : "Monthly"}</th>
                    {packs.map((p) => (
                      <td key={p.id} className={`p-3 text-center font-semibold tabular-nums ${p.popular ? "bg-cyan/[0.05]" : ""}`}>
                        {formatZAR(packFigures(p.id)[k])}{k === "monthly" && "/mo"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">What you save in year 1</h2>
          <div className="card relative mt-6 overflow-x-auto">
            <table className="w-full min-w-[52rem] text-right text-sm tabular-nums">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th scope="col" className={`${th} text-left`}>Pack</th>
                  <th scope="col" className={th}>Typical market</th>
                  <th scope="col" className={th}>Our tools bought separately</th>
                  <th scope="col" className={th}>Pack, year 1</th>
                  <th scope="col" className={th}>Save vs separately</th>
                  <th scope="col" className={th}>You save vs market</th>
                </tr>
              </thead>
              <tbody>
                {packs.map((p) => {
                  const f = packFigures(p.id);
                  return (
                    <tr key={p.id} className="border-b border-line last:border-0">
                      <th scope="row" className="p-3 text-left font-semibold">{p.name}</th>
                      <td className="p-3 text-muted">{formatZAR(p.marketY1)}</td>
                      <td className="p-3 text-muted">{formatZAR(f.separatelySetup + 12 * f.separatelyMonthly)}</td>
                      <td className="p-3 font-semibold">{formatZAR(f.year1)}</td>
                      <td className="p-3 font-semibold">{formatZAR(f.saveVsSeparately)}</td>
                      <td className="text-grad p-3 font-bold">{formatZAR(f.youSave)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Year 1 = setup + 12 months. Prices in ZAR, excluding VAT and third-party costs. Estimates are guides, not guarantees.</p>
        </section>
      </div>
      <CtaSection title="Not sure which pack? Build a quote and mix your own." />
    </>
  );
}
