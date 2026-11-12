// Task 8 replaces this with live phone-frame demos (Coil & Pod Finder, Flavour Finder, loyalty stamp, 18+ gate).
import { SectionHeading, section } from "./SectionHeading";

const DEMOS = ["Coil & Pod Finder", "Flavour Finder quiz", "Loyalty card stamp", "18+ age check"];

export function DemosSection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Try before you buy"
        title={<>See the tools <span className="text-grad">working.</span></>}
        sub="Sample data, real behaviour: what your customers will tap on their phones."
        center
      />
      <div className="card mx-auto mt-14 grid max-w-4xl gap-3 p-6 sm:grid-cols-2 sm:p-10">
        {DEMOS.map((d) => (
          <div key={d} className="flex aspect-[4/3] items-end rounded-2xl border border-line bg-[radial-gradient(circle_at_30%_20%,rgb(59_130_246/0.25),transparent_60%)] p-5">
            <p className="font-display font-semibold">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
