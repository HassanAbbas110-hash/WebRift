import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { TiltCard } from "@/components/fx/TiltCard";
import { NegotiableNote, PackCard } from "./PackCard";
import { SectionHeading, section } from "./SectionHeading";

export function FeaturedPacks() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Packs"
        title={<>One setup. One monthly plan. <span className="text-grad">Everything included.</span></>}
        sub="Ready-made packs cost far less than buying the tools one by one. Setup can be split into 3 instalments."
      />
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {(["vape-starter", "vape-pro", "vape-complete"] as const).map((id, i) => (
          <Reveal key={id} delay={i * 0.08} className="h-full"><TiltCard><PackCard id={id} /></TiltCard></Reveal>
        ))}
      </div>
      <NegotiableNote />
      <p className="mt-3 text-center">
        <Link href="/packs" className="text-sm font-semibold text-cyan hover:underline">See all 6 packs, including packs for any shop →</Link>
      </p>
    </section>
  );
}
