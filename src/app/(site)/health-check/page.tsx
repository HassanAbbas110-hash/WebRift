import type { Metadata } from "next";
import Link from "next/link";
import { productById } from "@/data/catalogue";
import { formatZAR } from "@/lib/quote";
import { HealthCheckForm } from "@/components/sections/HealthCheckForm";
import { SampleReport } from "@/components/sections/SampleReport";

export const metadata: Metadata = {
  title: "Free Business Health Check",
  description: "See how your shop compares with 5 nearby competitors on Google rating, reviews, replies, photos and website, with a score out of 10 and a 3-step action plan.",
  alternates: { canonical: "/health-check" },
};

const GETS = ["A score out of 10", "Side-by-side with 5 nearby competitors", "Google profile and review audit", "Website and social review", "An action plan in priority order"];

export default function HealthCheckPage() {
  return (
    <div className="relative isolate mx-auto max-w-7xl overflow-x-clip px-4 py-14 sm:px-6 sm:py-20">
      <div aria-hidden="true" className="absolute -top-20 right-0 -z-10 size-[30rem] rounded-full bg-violet/20 blur-[120px]" />
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <header>
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">Free Health Check</p>
          <h1 className="font-display mt-3 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
            How does your shop <span className="text-grad">really stack up?</span>
          </h1>
          <p className="mt-5 text-lg text-muted">
            We check your shop against 5 nearby competitors and send you a one-page report on WhatsApp. You&apos;ll see exactly where you win, where customers slip away and what to fix first.
          </p>
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {GETS.map((g) => <li key={g} className="flex gap-2"><span className="text-cyan">✓</span>{g}</li>)}
          </ul>
        </header>
        <HealthCheckForm />
      </div>

      <section className="mt-16 grid gap-5 md:grid-cols-2" aria-label="Health check options">
        <div className="rounded-3xl border border-line bg-panel/50 p-7"><p className="text-xs font-semibold tracking-wide text-cyan uppercase">Start here · Free</p><h2 className="font-display mt-3 text-2xl font-semibold">A one-page first look.</h2><p className="mt-3 leading-relaxed text-muted">A concise overview of your public presence, a high-level comparison with five nearby competitors and three practical priorities. Delivered on WhatsApp. No purchase required.</p><p className="mt-4 text-sm text-muted">Best for spotting where to start. It is not the full paid report.</p></div>
        <div className="rounded-3xl border border-cyan/30 bg-cyan/5 p-7"><p className="text-xs font-semibold tracking-wide text-cyan uppercase">Go deeper · {formatZAR(productById("health-check")!.setup)} once-off</p><h2 className="font-display mt-3 text-2xl font-semibold">The detailed Business Health Check.</h2><p className="mt-3 leading-relaxed text-muted">An extensive, multi-page review with competitor-by-competitor findings, supporting evidence, a closer look at your website and enquiry journey, Google and social presence, and a prioritised implementation roadmap.</p><p className="mt-4 text-sm text-muted">Built from available evidence. Private analytics are only included when you provide access; business results are not guaranteed.</p><Link href="/quote?p=health-check" className="mt-6 inline-block rounded-full border border-cyan/40 px-5 py-3 text-sm font-semibold text-cyan hover:bg-cyan/10">Add the detailed report to my quote →</Link></div>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your free one-page overview</h2>
        <p className="mt-2 text-muted">Example data for a fictional shop. Real reports use your shop&apos;s real numbers.</p>
        <div className="mt-8"><SampleReport /></div>
      </section>
    </div>
  );
}
