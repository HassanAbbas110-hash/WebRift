import { cities } from "@/data/catalogue";
import { SectionHeading, section } from "./SectionHeading";

// Task 8 may add the pulse-marker map; the list stays for SEO.
export function CitiesSection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Cities we serve"
        title={<>Local shops, <span className="text-grad">all over South Africa.</span></>}
        sub="We work with shops in these cities, and anywhere else in South Africa over WhatsApp."
      />
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cities.map((c) => (
          <li key={c} className="card flex items-center gap-3 px-5 py-4 font-medium">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
