"use client";

import { useRef, useState } from "react";
import { AgeGate } from "./AgeGate";
import { CoilFinder } from "./CoilFinder";
import { FlavourFinder } from "./FlavourFinder";
import { LoyaltyCard } from "./LoyaltyCard";
import { appear } from "./OrderLink";

const DEMOS = [
  { id: "coil", label: "Coil & Pod Finder", Demo: CoilFinder, about: "Customers pick their device and see only the coils and pods that fit, then order on WhatsApp. Fewer wrong parts, fewer returns." },
  { id: "flavour", label: "Flavour Finder", Demo: FlavourFinder, about: "Five quick taps narrow a long e-liquid list to three suggestions from your own stock." },
  { id: "loyalty", label: "Loyalty card", Demo: LoyaltyCard, about: "A digital stamp card on the customer's phone. Staff stamp each visit; the 10th stamp shows the reward." },
  { id: "age", label: "18+ age check", Demo: AgeGate, about: "The 18+ gate a vape shop needs before showing its menu. Staff still check ID at collection." },
] as const;

/** Live phone-frame demos with accessible tabs (arrow keys move between tabs). Sample data only. */
export default function PhoneDemos() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { id, Demo, about, label } = DEMOS[active];

  const onKey = (e: React.KeyboardEvent) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const next = (active + d + DEMOS.length) % DEMOS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto]">
      <div>
        <div role="tablist" aria-label="Live demos" onKeyDown={onKey} className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {DEMOS.map((d, i) => (
            <button
              key={d.id}
              ref={(el) => { tabs.current[i] = el; }}
              role="tab"
              id={`demo-tab-${d.id}`}
              aria-selected={i === active}
              aria-controls={`demo-panel-${d.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`rounded-2xl border px-4 py-3 text-left font-display font-semibold transition ${i === active ? "border-cyan/60 bg-cyan/10 text-text shadow-[0_0_30px_-10px_var(--cyan)]" : "border-line bg-white/[0.03] text-muted hover:border-cyan/40"}`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p key={id} className={`${appear} mt-6 max-w-md text-muted`}>{about}</p>
        <p className="mt-3 text-xs text-muted">Sample products and names. WhatsApp buttons open a chat with WebRift marked &ldquo;(demo)&rdquo;.</p>
      </div>

      {/* Phone frame */}
      <div className="relative mx-auto w-full max-w-[22rem] rounded-[2.75rem] border border-white/15 bg-[#04060f] p-3 shadow-[0_40px_120px_-40px_rgba(59,130,246,0.7)]">
        <div aria-hidden="true" className="absolute top-5 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div
          role="tabpanel"
          id={`demo-panel-${id}`}
          aria-labelledby={`demo-tab-${id}`}
          className="h-[34rem] overflow-y-auto rounded-[2.2rem] bg-bg px-4 pt-12 pb-6 [scrollbar-width:none]"
        >
          <p className="mb-4 text-center text-xs text-muted">{label} · demo</p>
          <div key={id} className={appear}><Demo /></div>
        </div>
      </div>
    </div>
  );
}
