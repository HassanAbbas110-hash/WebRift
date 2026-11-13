"use client";

import { useRef } from "react";

/** Tilts toward a mouse pointer with a glow that follows it. Touch and reduced motion get a still card. */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const reset = () => { ref.current!.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={reset} className={`group relative h-full transition-transform duration-300 ease-out ${className}`}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--gx,50%)_var(--gy,0%),rgb(34_211_238/0.14),transparent_45%)]"
      />
    </div>
  );
}
