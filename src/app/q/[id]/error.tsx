"use client"; // Error boundaries must be Client Components

import { waLink } from "@/lib/site";

export default function QuoteError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">We couldn&apos;t load this quote right now</h1>
      <p className="mt-3 text-muted">Please try again in a minute, or message us and we&apos;ll send it to you.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="rounded-full border border-line bg-white/5 px-5 py-2.5 text-sm font-semibold hover:border-cyan">Try again</button>
        <a href={waLink("Hi WebRift, I couldn't open my saved quote.")} target="_blank" rel="noopener noreferrer" className="bg-grad rounded-full px-5 py-2.5 text-sm font-semibold text-white">WhatsApp us</a>
      </div>
    </div>
  );
}
