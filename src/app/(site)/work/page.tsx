import type { Metadata } from "next";
import Link from "next/link";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
export const metadata: Metadata = { title: "Our work", description: "Explore WebRift client websites, business concepts and platform demos. Saved designs for legal, automotive, food, beauty and delivery businesses.", alternates: { canonical: "/work" } };
export default function WorkPage() {
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
    <header className="mb-10 max-w-3xl"><p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">The WebRift portfolio</p><h1 className="font-display mt-4 text-5xl font-bold tracking-tight sm:text-7xl">Built for business.<br /><span className="text-grad">Made to feel like yours.</span></h1><p className="mt-6 text-lg leading-relaxed text-muted">A selection of delivered client projects, business demos and platform work. Each has its own audience, visual identity and customer journey.</p><p className="mt-4 text-sm text-muted">Screenshots are saved design records, not live embeds. Demos are not presented as commissioned client work. Archived clients stay credited even when their hosting ends.</p></header>
    <ProjectGallery />
    <section className="mt-16 rounded-3xl border border-cyan/20 bg-cyan/5 p-8 sm:p-12"><h2 className="font-display text-3xl font-bold">Your business could be next.</h2><p className="mt-3 max-w-xl text-muted">Start with a pack, then shape the design and tools around your shop.</p><Link href="/quote" className="bg-grad mt-6 inline-block rounded-full px-6 py-3 font-semibold text-white">Build my quote →</Link></section>
  </div>;
}
