"use client";

import { useMotionMode } from "./motion-store";
import { useEffect, useRef } from "react";

/** Counts up from 0 when first scrolled into view. Server HTML and reduced motion show the final value. */
export function Counter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const { mode } = useMotionMode();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (mode === "lite") return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        el.textContent = String(Math.round(value * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.textContent = String(value); };
  }, [value, duration, mode]);
  return <span ref={ref} className="tabular-nums">{value}</span>;
}
