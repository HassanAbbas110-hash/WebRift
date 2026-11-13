import { PhoneDemosLazy } from "@/components/fx/lazy";
import { SectionHeading, section } from "./SectionHeading";

export function DemosSection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Try before you buy"
        title={<>See the tools <span className="text-grad">working.</span></>}
        sub="Sample data, real behaviour: what your customers will tap on their phones."
        center
      />
      <PhoneDemosLazy />
    </section>
  );
}
