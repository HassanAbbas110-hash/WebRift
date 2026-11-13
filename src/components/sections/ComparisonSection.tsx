import Link from "next/link";
import { SectionHeading, section } from "./SectionHeading";
const rows = [
  ["Getting started", "You choose the template, tools and integrations.", "Ask what discovery, design and setup are included.", "Six priced packs, with a quote you can customise."],
  ["Shop-specific tools", "You select and connect the tools yourself.", "Check whether each tool is included or an extra.", "WhatsApp storefronts, finders, loyalty and shop-control options."],
  ["Ongoing care", "You manage updates or hire someone separately.", "Confirm support hours, edit limits and response times.", "Hosting, WhatsApp support and up to five small edits per month in packs."],
  ["Before you commit", "Try the builder and check recurring app costs.", "Review the portfolio, proposal and ownership terms.", "Explore our work, try demos and see setup, monthly and year-one totals."],
  ["Best fit", "Owners who want to build and maintain their own site.", "Depends on the provider; compare scope and specialist expertise.", "Local shops wanting a focused toolkit and a direct working relationship."],
];
export function ComparisonSection() {
  return <section className={section}>
    <SectionHeading eyebrow="Why WebRift" title={<>Small-shop focus.<br /><span className="text-grad">A clearer way to get online.</span></>} sub="Choose on fit, scope and support—not a score we gave ourselves. Here is what to compare before you decide." />
    <div className="mt-10 grid gap-4 md:grid-cols-3">{[["01", "Practical, not complicated", "Your customers already use WhatsApp. Our storefront tools make those enquiries and orders easier to put together."],["02", "Your business, your style", "A law firm, restaurant and workshop should not all look the same. Explore the portfolio to see our range."],["03", "Know the commitment", "See setup, monthly and first-year figures before you enquire. Confirm the final scope and ongoing terms in your proposal."]].map(([n,title,copy]) => <div key={n} className="card p-6"><span className="font-display text-sm text-cyan">{n}</span><h3 className="font-display mt-4 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p></div>)}</div>
    <div className="card mt-8 overflow-x-auto"><table className="w-full min-w-[44rem] text-left text-sm"><caption className="sr-only">Compare delivery approaches and WebRift inclusions</caption><thead><tr className="border-b border-line">{["What to compare","Do it yourself","Another provider","WebRift"].map((h,i) => <th scope="col" key={h} className={`p-5 font-semibold ${i===3 ? "bg-cyan/5 text-cyan" : "text-muted"}`}>{h}</th>)}</tr></thead><tbody>{rows.map(([label,...cells]) => <tr key={label} className="border-b border-line last:border-0"><th scope="row" className="p-5 font-medium">{label}</th>{cells.map((c,i) => <td key={i} className={`p-5 leading-relaxed ${i===2 ? "bg-cyan/5" : "text-muted"}`}>{c}</td>)}</tr>)}</tbody></table></div>
    <p className="mt-4 text-xs leading-relaxed text-muted">Provider offerings vary. This explains our approach, not an independent ranking or a claim that every agency offers the same service. Third-party charges and agreed scope still apply.</p>
    <Link href="/packs" className="mt-6 inline-block text-sm font-semibold text-cyan hover:underline">Compare WebRift packs and inclusions →</Link>
  </section>;
}
