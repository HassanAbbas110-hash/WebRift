"use client";

import { useState } from "react";
import { STAMPS_FOR_REWARD, stamp } from "@/lib/fx";
import { OrderLink } from "./OrderLink";

export function LoyaltyCard() {
  const [card, setCard] = useState({ stamps: 0, reward: false });
  return (
    <div className="space-y-4">
      <div className="bg-grad rounded-2xl p-4 text-white shadow-[0_20px_50px_-20px_rgba(124,58,237,0.8)]">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-80">Sample Vape Lounge · loyalty</p>
        <p className="font-display mt-1 text-lg font-semibold">10 visits, then a reward</p>
        <ol className="mt-3 grid grid-cols-5 gap-2" aria-label={`${card.stamps} of ${STAMPS_FOR_REWARD} stamps`}>
          {Array.from({ length: STAMPS_FOR_REWARD }, (_, i) => (
            <li key={i} className="grid aspect-square place-items-center rounded-full border-2 border-white/40 bg-white/10">
              {i < card.stamps && (
                <span aria-hidden="true" className="grid size-full place-items-center rounded-full bg-white text-sm font-bold text-blue motion-safe:animate-[fx-pop_0.4s_ease-out_both]">
                  {i === STAMPS_FOR_REWARD - 1 ? "★" : "✓"}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      <div aria-live="polite">
        {card.reward ? (
          <div className="rounded-xl border border-cyan/50 bg-cyan/10 p-3 text-center motion-safe:animate-[fx-pop_0.5s_ease-out_both]">
            <p className="font-display text-lg font-semibold">Reward unlocked</p>
            <p className="mb-3 text-sm text-muted">R50 off your next visit.</p>
            <OrderLink text="Hi, my loyalty card is full. I'd like to claim my reward" label="Claim on WhatsApp" />
          </div>
        ) : (
          <p className="text-center text-sm text-muted">{STAMPS_FOR_REWARD - card.stamps} more until your reward</p>
        )}
      </div>
      <button type="button" onClick={() => setCard(stamp)} className="w-full rounded-xl border border-line bg-white/[0.04] py-3 font-semibold transition hover:border-cyan/50 active:scale-[0.98]">
        {card.reward ? "Start a new card" : "Tap to stamp (staff)"}
      </button>
    </div>
  );
}
