import { CityMap } from "@/components/fx/CityMap";
import { cities } from "@/data/catalogue";
import { SectionHeading, section } from "./SectionHeading";

// The map is decoration; the list carries the content (and SEO).
export function CitiesSection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Cities we serve"
        title={<>Local shops, <span className="text-grad">all over South Africa.</span></>}
        sub="We work with shops in these cities, and anywhere else in South Africa over WhatsApp."
      />
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="card flex justify-center p-4 sm:p-8">
          <CityMap cities={cities} />
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {cities.map((c) => (
            <li key={c} className="card flex items-center gap-3 px-5 py-4 font-medium">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-cyan shadow-[0_0_12px_var(--cyan)]" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
