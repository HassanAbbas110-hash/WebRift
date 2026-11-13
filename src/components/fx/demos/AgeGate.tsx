"use client";

import { useState } from "react";
import { OrderLink, appear } from "./OrderLink";

const NOTE = "Self-declaration only — ID still checked at collection.";

export function AgeGate() {
  const [answer, setAnswer] = useState<"yes" | "no">();
  const reset = (
    <button type="button" onClick={() => setAnswer(undefined)} className="w-full rounded-xl border border-line py-2 text-sm text-muted hover:text-text">
      Reset demo
    </button>
  );

  if (answer === "yes") {
    return (
      <div className={`${appear} space-y-3`}>
        <p className="font-display text-lg font-semibold">Welcome in</p>
        <p className="text-sm text-muted">The shop menu opens. The check is remembered for this visit only.</p>
        <p className="rounded-xl border border-line bg-white/[0.04] p-3 text-xs text-muted">{NOTE}</p>
        <OrderLink text="Hi, I'd like to place a click & collect order" />
        {reset}
      </div>
    );
  }
  if (answer === "no") {
    return (
      <div className={`${appear} space-y-3 text-center`}>
        <p className="font-display text-lg font-semibold">Sorry, this shop is 18+ only</p>
        <p className="text-sm text-muted">The menu stays hidden.</p>
        {reset}
      </div>
    );
  }
  return (
    <div className="relative min-h-[19rem]">
      {/* Blurred stand-in for the shop behind the gate. */}
      <div aria-hidden="true" className="space-y-2 opacity-40 blur-sm">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl bg-white/10" />)}
      </div>
      <div role="group" aria-labelledby="agegate-title" className={`${appear} absolute inset-x-0 top-4 rounded-2xl border border-line bg-panel p-4 text-center shadow-2xl`}>
        <p className="mx-auto grid size-12 place-items-center rounded-full border-2 border-cyan font-display font-bold text-cyan">18+</p>
        <p id="agegate-title" className="font-display mt-3 text-lg font-semibold">Are you 18 or older?</p>
        <p className="mt-1 text-xs text-muted">{NOTE}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setAnswer("no")} className="rounded-xl border border-line py-2.5 font-semibold hover:border-cyan/50">No</button>
          <button type="button" onClick={() => setAnswer("yes")} className="bg-grad rounded-xl py-2.5 font-semibold text-white">Yes, I&apos;m 18+</button>
        </div>
      </div>
    </div>
  );
}
