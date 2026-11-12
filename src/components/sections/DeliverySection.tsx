import { Reveal } from "@/components/fx/Reveal";
import { SectionHeading, section } from "./SectionHeading";

// Catalogue p.24.
const STEPS = [
  { when: "Day 0", title: "Order and deposit", body: "Pick a pack, pay the 50% deposit (or the first of 3 instalments)." },
  { when: "Day 1–2", title: "Shop questionnaire", body: "We collect your logo, photos, product list, hours and WhatsApp number." },
  { when: "Day 3–7", title: "Build", body: "We build the site and tools and send you a preview link." },
  { when: "Day 7–10", title: "Launch", body: "One round of changes, then we go live and set up Google and your profiles." },
  { when: "Month 2+", title: "Care plan", body: "Free edits, support and a monthly report." },
];
const PROVIDE = [
  "Logo (or we make a simple one)",
  "Product or price list in Excel, photos or a supplier sheet",
  "Opening hours and address",
  "WhatsApp number to take orders",
  "Access to the Google Business Profile, if one exists",
  "Photos of the shop and best sellers",
  "A decision-maker who can approve within 48 hours",
];
const RECEIVE = [
  "A live, mobile-friendly site on your own domain",
  "Business email (e.g. info@yourshop.co.za)",
  "Google Maps and profile tidied up",
  "A short how-to video for staff",
  "Written list of what is included",
  "Support by WhatsApp from day one",
  "First free-edits month starts at launch",
];

export function DeliverySection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="How we deliver"
        title={<>From first message to <span className="text-grad">a live shop.</span></>}
        sub="Clear steps, short timelines and no surprises."
      />
      {/* Task 8 swaps this for the timeline that draws on scroll. */}
      <ol className="relative mt-14 grid gap-6 before:absolute before:top-5 before:bottom-5 before:left-5 before:w-px before:bg-[image:var(--grad)] before:opacity-50 md:grid-cols-5 md:gap-4 md:before:right-0 md:before:bottom-auto md:before:left-0 md:before:h-px md:before:w-auto">
        {STEPS.map((s, i) => (
          <li key={s.when}>
            <Reveal delay={i * 0.08} className="relative pl-16 md:pt-16 md:pl-0">
              <span className="bg-grad absolute top-0 left-0 grid size-10 place-items-center rounded-full font-bold text-white shadow-[0_0_24px_-2px_rgba(59,130,246,0.8)]">{i + 1}</span>
              <p className="text-xs font-semibold tracking-widest text-cyan uppercase">{s.when}</p>
              <h3 className="font-display mt-1 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {([["You provide", PROVIDE], ["You receive", RECEIVE]] as const).map(([title, items]) => (
          <div key={title} className="card p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {items.map((t) => <li key={t} className="flex gap-2"><span className="text-cyan">✓</span>{t}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">
        Timelines are our targets for a shop that sends its material promptly. Vape shops need an age-check test before launch, so allow a little extra time.
      </p>
    </section>
  );
}
