import Link from "next/link";
import { Fragment } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Counter } from "@/components/fx/Counter";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { cities, packs, products } from "@/data/catalogue";
import { HeroVisual } from "./HeroVisual";

const STATS: [number | string, string][] = [
  [products.length, "tools for local shops"],
  [packs.length, "ready-made packs"],
  ["7–10", "days to launch"],
  [cities.length, "cities served"],
];
const HEADLINE = "Websites, Google visibility and loyalty tools that bring customers back.".split(" ");
// CSS-only entrance (no JS needed): the logo draws, then words rise in. motion-safe: so reduced motion shows everything at once.
const rise = "motion-safe:animate-[fx-fade-up_0.8s_cubic-bezier(0.22,1,0.36,1)_both]";
const at = (s: number) => ({ animationDelay: `${s}s` });

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroVisual />
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center px-4 pt-16 pb-20 text-center sm:px-6">
        <LogoMark size={88} className="logo-draw drop-shadow-[0_0_40px_rgba(34,211,238,0.45)]" />
        <p style={at(0.2)} className={`${rise} mt-8 rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur`}>
          <span className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
          Digital tools for South African shops
        </p>
        <h1 className="font-display mt-6 max-w-5xl text-[2.6rem] leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-7xl lg:text-[5.5rem]">
          {HEADLINE.map((w, i) => (
            <Fragment key={i}>
              <span style={at(0.35 + i * 0.06)} className="inline-block motion-safe:animate-[fx-word_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">{w}</span>{" "}
            </Fragment>
          ))}
          {/* Animated as one unit: gradient text on transformed children can render blank. */}
          <span style={at(0.35 + HEADLINE.length * 0.06)} className={`text-grad mt-3 block ${rise}`}>Built for South African shops.</span>
        </h1>
        <p style={at(1.2)} className={`${rise} mt-7 max-w-xl text-lg text-pretty text-muted sm:text-xl`}>
          WhatsApp-first. Live in days. Pricing that suits a small shop.
        </p>
        <div style={at(1.35)} className={`${rise} mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row`}>
          <MagneticButton>
            <Link href="/quote" className="bg-grad rounded-full px-8 py-4 text-center font-semibold text-white shadow-[0_0_48px_-6px_rgba(59,130,246,0.8)] transition hover:brightness-110">
              Build my quote →
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/health-check" className="rounded-full border border-cyan/40 bg-white/5 px-8 py-4 text-center font-semibold text-text backdrop-blur transition hover:border-cyan hover:bg-white/10">
              Free health check
            </Link>
          </MagneticButton>
        </div>
        <dl style={at(1.5)} className={`${rise} mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4`}>
          {STATS.map(([n, l]) => (
            <div key={l} className="flex flex-col-reverse bg-bg/80 px-4 py-5 backdrop-blur">
              <dt className="mt-1 text-xs text-muted">{l}</dt>
              <dd className="font-display text-3xl font-bold">{typeof n === "number" ? <Counter value={n} /> : n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
