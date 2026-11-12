import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { cities, packs, products } from "@/data/catalogue";
import { HeroVisual } from "./HeroVisual";

const STATS = [
  [String(products.length), "tools for local shops"],
  [String(packs.length), "ready-made packs"],
  ["7–10", "days to launch"],
  [String(cities.length), "cities served"],
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroVisual />
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center px-4 pt-16 pb-20 text-center sm:px-6">
        <LogoMark size={88} className="drop-shadow-[0_0_40px_rgba(34,211,238,0.45)]" />
        <p className="mt-8 rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur">
          <span className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
          Digital tools for South African shops
        </p>
        <h1 className="font-display mt-6 max-w-5xl text-[2.6rem] leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-7xl lg:text-[5.5rem]">
          Websites, Google visibility and loyalty tools that bring customers back.
          <span className="text-grad mt-3 block">Built for South African shops.</span>
        </h1>
        <p className="mt-7 max-w-xl text-lg text-pretty text-muted sm:text-xl">
          WhatsApp-first. Live in days. Pricing that suits a small shop.
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/quote" className="bg-grad rounded-full px-8 py-4 font-semibold text-white shadow-[0_0_48px_-6px_rgba(59,130,246,0.8)] transition hover:brightness-110">
            Build my quote →
          </Link>
          <Link href="/health-check" className="rounded-full border border-cyan/40 bg-white/5 px-8 py-4 font-semibold text-text backdrop-blur transition hover:border-cyan hover:bg-white/10">
            Free health check
          </Link>
        </div>
        <dl className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="flex flex-col-reverse bg-bg/80 px-4 py-5 backdrop-blur">
              <dt className="mt-1 text-xs text-muted">{l}</dt>
              <dd className="font-display text-3xl font-bold">{n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
