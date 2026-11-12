import type { Metadata } from "next";
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

      <section className="mt-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">What you&apos;ll get</h2>
        <p className="mt-2 text-muted">Example data for a fictional shop. Real reports use your shop&apos;s real numbers.</p>
        <div className="mt-8"><SampleReport /></div>
      </section>
    </div>
  );
}
