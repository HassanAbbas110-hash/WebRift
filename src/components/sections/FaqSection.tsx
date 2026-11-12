import { faq } from "@/data/catalogue";
import { SectionHeading, section } from "./SectionHeading";

// Native <details>: an accordion with zero JavaScript.
export function FaqSection() {
  return (
    <section className={section}>
      <SectionHeading eyebrow="FAQ" title={<>Questions shop owners <span className="text-grad">ask us.</span></>} center />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faq.map((f) => (
          <details key={f.q} className="card group px-6 py-5 open:border-cyan/30">
            <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-cyan transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
