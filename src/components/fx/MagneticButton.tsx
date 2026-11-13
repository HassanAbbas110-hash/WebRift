"use client";

import { useRef } from "react";

const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Wraps a CTA so it drifts toward a mouse pointer. Touch and reduced motion get the plain button. */
export function MagneticButton({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || still()) return;
    const b = ref.current!.getBoundingClientRect();
    ref.current!.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * strength}px, ${(e.clientY - b.top - b.height / 2) * strength}px)`;
  };
  const reset = () => { ref.current!.style.transform = ""; };
  return (
    <span ref={ref} onPointerMove={move} onPointerLeave={reset} className="inline-flex transition-transform duration-300 ease-out *:w-full">
      {children}
    </span>
  );
}
