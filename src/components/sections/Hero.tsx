import Image from "next/image";
import Link from "next/link";
import { packs, products } from "@/data/catalogue";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return <section className="relative isolate overflow-hidden border-b border-line">
    <HeroVisual />
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:min-h-[min(780px,calc(100svh-4rem))] lg:grid-cols-[1.1fr_1fr] lg:gap-10">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1.5 text-xs font-medium text-cyan"><span className="size-1.5 rounded-full bg-cyan" />Independent studio. South African shops.</p>
        <h1 className="font-display mt-6 text-[clamp(2.7rem,5.4vw,4.8rem)] leading-[1.04] font-bold tracking-[-0.045em]">More than a website.<br /><span className="text-grad">Your shop’s next move.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">Websites, Google visibility and loyalty tools that help local shops get found, take clearer orders and bring customers back.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/quote" className="bg-grad rounded-full px-6 py-3.5 text-center font-semibold text-white shadow-[0_0_36px_-8px_rgba(59,130,246,0.7)] transition hover:brightness-110">Build my quote →</Link>
          <Link href="/work" className="rounded-full border border-cyan/30 bg-white/5 px-6 py-3.5 text-center font-semibold transition hover:border-cyan hover:bg-white/10">See our work ↗</Link>
        </div>
        <p className="mt-5 text-sm text-muted">WhatsApp-first. Clear setup + monthly pricing. <Link href="/health-check" className="text-cyan underline underline-offset-4">Start with a free check.</Link></p>
        <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">{[[String(products.length), "shop tools"], [String(packs.length), "flexible packs"], ["7–10 days", "target launch*"]].map(([n,l]) => <div key={l}><dt className="text-xs text-muted">{l}</dt><dd className="font-display mt-1 text-xl font-semibold sm:text-2xl">{n}</dd></div>)}</dl>
        <p className="mt-3 text-[11px] text-muted">*After your content is ready; scope and third-party approvals can affect timing.</p>
      </div>
      <div className="relative min-w-0 lg:pl-4">
        <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-full bg-blue/10 blur-3xl" />
        <div className="rounded-[1.6rem] border border-white/15 bg-panel/80 p-2.5 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between px-2 pt-1 pb-3 text-[10px] text-muted"><span aria-hidden="true" className="flex gap-1.5"><i className="size-1.5 rounded-full bg-cyan/60" /><i className="size-1.5 rounded-full bg-blue/60" /><i className="size-1.5 rounded-full bg-violet/60" /></span><span>MS Haroon Attorneys · Client project</span></div>
          <Link href="/work" aria-label="Explore the MS Haroon Attorneys project" className="relative block aspect-[16/11] overflow-hidden rounded-xl"><Image src="/work/msh-attorneys.jpg" alt="Navy-and-white MS Haroon Attorneys website created by WebRift" fill sizes="(max-width: 1024px) 100vw, 560px" preload className="object-cover object-top" /></Link>
        </div>
        <div className="relative -mt-8 mr-4 ml-6 grid grid-cols-2 gap-3 sm:mr-6 sm:ml-10">
          {[{src:"/work/hayats.jpg",name:"Hayats Auto Body"},{src:"/work/barakah.jpg",name:"Al Barakah"}].map((p) => <Link href="/work" key={p.name} className="overflow-hidden rounded-2xl border border-white/15 bg-panel p-1.5 shadow-xl"><div className="relative aspect-[16/10] overflow-hidden rounded-xl"><Image src={p.src} alt={`${p.name} business demo design`} fill sizes="(max-width: 1024px) 45vw, 250px" className="object-cover object-top" /></div><p className="px-2 pt-2 pb-1 text-[10px] text-muted">{p.name} <span className="text-cyan">· Demo</span></p></Link>)}
        </div>
      </div>
    </div>
  </section>;
}
