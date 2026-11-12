import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";

// Placeholder hero; the real home page sections arrive in later tasks.
export default function Home() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-blue/25 blur-[120px]" />
        <div className="absolute top-40 -left-40 h-96 w-96 rounded-full bg-cyan/20 blur-[100px]" />
        <div className="absolute top-20 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet/30 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
        <LogoMark size={112} className="drop-shadow-[0_0_40px_rgba(34,211,238,0.45)]" />
        <p className="mt-10 rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted">
          Websites &amp; digital tools for South African shops
        </p>
        <h1 className="font-display mt-6 text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-7xl">
          Websites that sell —<br />
          <span className="text-grad">built for your shop.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-pretty text-muted">
          Premium design, fast delivery and clear pricing in rand. See exactly what you&apos;ll pay before you commit.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/quote"
            className="bg-grad rounded-full px-7 py-3.5 font-semibold text-white shadow-[0_0_40px_-6px_rgba(59,130,246,0.8)] transition hover:brightness-110"
          >
            Build a quote →
          </Link>
          <Link
            href="/packs"
            className="rounded-full border border-cyan/40 bg-white/5 px-7 py-3.5 font-semibold text-text transition hover:border-cyan hover:bg-white/10"
          >
            See the packs
          </Link>
        </div>
      </div>
    </section>
  );
}
