"use client";

import { useEffect, useRef } from "react";

const MESSY = [
  "hi do u have the 0.4 coils",
  "the mesh ones",
  "need 2",
  "also mango ice?? 30ml",
  "can i fetch at 3",
  "u guys open today?",
];
const ORDER: [string, string][] = [
  ["2×", "Coil 0.4Ω"],
  ["1×", "Mango Ice 30ml"],
  ["Collect", "15:00 today"],
  ["Note", "ID required"],
];

/**
 * Pinned scroll story: a messy WhatsApp thread tidies into an order card.
 * The server HTML (and reduced motion) shows both sides statically; GSAP only adds the pinned scrub.
 */
export default function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let revert = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia(root.current);
      // Pin when the stage fits beside itself (md+); on phones the stacked stage is too tall to pin, so it scrubs in place.
      mm.add({ ok: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 768px)" }, (ctx) => {
        const { ok, wide } = ctx.conditions!;
        if (!ok) return;
        const q = gsap.utils.selector(root.current);
        gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: wide
            ? { trigger: root.current, start: "top top+=64", end: "+=140%", pin: true, scrub: 0.6 }
            : { trigger: root.current, start: "top 85%", end: "bottom 90%", scrub: 0.6 },
        })
          .from(q("[data-msg]"), { opacity: 0, y: 24, stagger: 0.12, duration: 0.4 })
          .to(q("[data-msg]"), { opacity: 0.15, scale: 0.92, filter: "blur(2px)", stagger: 0.05, duration: 0.4 }, "+=0.2")
          .from(q("[data-arrow]"), { opacity: 0, scale: 0.4, duration: 0.3 }, "<")
          .from(q("[data-card]"), { opacity: 0, y: 40, scale: 0.95, duration: 0.5 }, "<0.1")
          .from(q("[data-line]"), { opacity: 0, x: -16, stagger: 0.12, duration: 0.3 })
          .from(q("[data-stamp]"), { opacity: 0, scale: 1.6, rotate: -12, duration: 0.3 });
      });
      revert = () => mm.revert();
    })();
    return () => { cancelled = true; revert(); };
  }, []);

  return (
    <div ref={root} className="mt-14 grid items-center gap-6 md:motion-safe:min-h-[calc(100svh-8rem)] md:grid-cols-[1fr_auto_1fr]">
      <div className="card p-5 sm:p-6">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase">
          <span className="size-2 rounded-full bg-[#25d366]" /> Before: the WhatsApp thread
        </p>
        <ul className="mt-4 space-y-2">
          {MESSY.map((m, i) => (
            <li
              key={m}
              data-msg
              className={`w-fit max-w-[85%] rounded-2xl px-4 py-2 text-sm ${i % 3 === 2 ? "ml-auto rounded-tr-sm bg-[#25d366]/15" : "rounded-tl-sm bg-white/[0.06]"}`}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
      <span data-arrow aria-hidden="true" className="text-grad font-display mx-auto rotate-90 text-4xl font-bold md:rotate-0">→</span>
      <div data-card className="card relative border-cyan/40 p-5 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.45)] sm:p-6">
        <p className="text-xs font-semibold tracking-widest text-cyan uppercase">After: one tidy order</p>
        <p className="font-display mt-3 text-lg font-semibold">Order #1042 · Click &amp; Collect</p>
        <dl className="mt-3 divide-y divide-line rounded-2xl bg-white/[0.04] p-4 text-sm">
          {ORDER.map(([k, v]) => (
            <div key={v} data-line className="flex justify-between gap-4 py-2">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <p data-stamp className="absolute -top-3 right-5 rotate-[-6deg] rounded-full bg-grad px-3 py-1 text-xs font-bold text-white">Ready ✓</p>
        <p className="mt-3 text-xs text-muted">Sample order. Your customer still sends it on WhatsApp.</p>
      </div>
    </div>
  );
}
