import Link from "next/link";
import { waLink } from "@/lib/site";

export function CtaSection({ title = "Ready to bring more customers through the door?" }: { title?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-cyan/30 px-6 py-16 text-center sm:px-16 sm:py-24">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(59_130_246/0.35),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgb(124_58_237/0.35),transparent_60%)]" />
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />
        <h2 className="font-display mx-auto max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">Build your quote in a minute, or say hi on WhatsApp. No obligation, prices in rand.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/quote" className="bg-grad rounded-full px-8 py-4 font-semibold text-white shadow-[0_0_48px_-6px_rgba(59,130,246,0.8)] transition hover:brightness-110">
            Build my quote →
          </Link>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#25d366]/50 bg-[#25d366]/10 px-8 py-4 font-semibold transition hover:bg-[#25d366]/20">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
