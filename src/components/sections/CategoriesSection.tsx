import Link from "next/link";
import { products } from "@/data/catalogue";
import { CATEGORIES } from "@/lib/content";
import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading, section } from "./SectionHeading";

export function Icon({ d, className = "size-6" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={d} />
    </svg>
  );
}

export function CategoriesSection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="What we do"
        title={<>Everything a local shop <span className="text-grad">needs online.</span></>}
        sub="Not just a website. Six kinds of tools that get you found, take the order, and bring the customer back next week."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const count = products.filter((p) => p.category === c.id).length;
          return (
            <Reveal key={c.id} delay={(i % 3) * 0.08}>
              <Link href={`/services?c=${c.id}`} className="card group relative block h-full overflow-hidden p-7 transition hover:border-cyan/40">
                <div aria-hidden="true" className="absolute -top-16 -right-16 size-40 rounded-full bg-blue/20 opacity-0 blur-3xl transition group-hover:opacity-100" />
                <span className="grid size-12 place-items-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan">
                  <Icon d={c.icon} />
                </span>
                <h3 className="font-display mt-6 text-xl font-semibold">{c.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.blurb}</p>
                <p className="mt-6 text-xs font-medium text-cyan">
                  {count} {count === 1 ? "tool" : "tools"} <span className="inline-block transition group-hover:translate-x-1">→</span>
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
