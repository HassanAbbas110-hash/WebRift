import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";

export const metadata: Metadata = {
  title: "Build your quote",
  description: "Pick a pack, add products and see your WebRift price in rand, instantly. Save it, print it or share it on WhatsApp.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-cyan">Instant quote</p>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Build your quote in <span className="text-grad">under a minute.</span>
        </h1>
        <p className="mt-4 text-muted">Clear prices in rand, excluding VAT. No obligation: save it, print it or send it on WhatsApp.</p>
      </header>
      {/* The builder reads its state from the URL, so it renders in the browser behind this boundary. */}
      <Suspense fallback={<div className="h-[60svh] animate-pulse rounded-3xl bg-white/[0.03]" />}>
        <QuoteBuilder />
      </Suspense>
    </div>
  );
}
