import { Reveal } from "@/components/fx/Reveal";
import { COMPARE_COLS, RATINGS, compareRows } from "@/lib/content";
import { RatingBars } from "./RatingBars";
import { SectionHeading, section } from "./SectionHeading";

const US = COMPARE_COLS.length - 1;

export function ComparisonSection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Compare"
        title={<>WebRift vs <span className="text-grad">the other options.</span></>}
        sub="Doing it yourself, hiring an agency or a freelancer: here is how it stacks up for a small shop."
      />
      <Reveal className="mt-14">
      <div className="card relative overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <caption className="sr-only">WebRift compared with DIY, agencies and freelancers</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="p-4"><span className="sr-only">Feature</span></th>
              {COMPARE_COLS.map((c, i) => (
                <th key={c} scope="col" className={`font-display p-4 font-semibold ${i === US ? "bg-cyan/[0.06] text-cyan" : "text-muted"}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows().map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <th scope="row" className="p-4 font-medium">{r.label}</th>
                {r.cells.map((c, i) => (
                  <td key={i} className={`p-4 ${i === US ? "bg-cyan/[0.06] font-medium" : "text-muted"}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Reveal>
      <p className="mt-3 text-xs text-muted">
        Entry store, agency, maintenance and Shopify prices: ProCompare, &ldquo;The real cost of an e-commerce website in SA&rdquo;. Other cells are our own view.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold">
            Overall rating <span className="text-sm font-normal text-muted">(our own view, out of 10)</span>
          </h3>
          <div className="mt-6"><RatingBars /></div>
        </div>
        <div className="card relative overflow-x-auto p-6 sm:p-8">
          <table className="w-full text-sm">
            <caption className="font-display mb-4 text-left text-xl font-semibold">Score by area</caption>
            <thead>
              <tr className="text-muted">
                <th scope="col" className="pb-2 text-left font-normal">Area</th>
                {COMPARE_COLS.map((c) => <th key={c} scope="col" className="px-1.5 pb-2 font-normal">{c.split(" ").pop()}</th>)}
              </tr>
            </thead>
            <tbody>
              {RATINGS.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="py-2 text-left font-medium">{r.label}</th>
                  {r.scores.map((s, i) => (
                    <td key={i} className={`py-2 text-center tabular-nums ${i === US ? "font-bold text-cyan" : "text-muted"}`}>{s}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted">
            We scored ourselves, so treat this as a starting point, not an independent review. Agencies win on support and flexibility for big
            projects; WebRift wins on price, speed and shop-specific tools for small shops.
          </p>
        </div>
      </div>
    </section>
  );
}
