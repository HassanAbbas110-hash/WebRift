"use client";

import { useEffect } from "react";

import { fmt } from "@/data/pitch";

/**
 * Brings the deck to life: marks slides as they enter view (CSS plays their entrance), counts up [data-count] numbers,
 * keeps the progress dots in sync and lets arrow keys / PageUp / PageDown move between slides.
 * Without JS (and in the PDF) everything simply shows in its final state.
 */
export function DeckMotion() {
  useEffect(() => {
    const deck = document.querySelector<HTMLElement>("[data-deck]");
    if (!deck) return;
    const slides = [...deck.querySelectorAll<HTMLElement>("[data-slide]")];
    const dots = [...document.querySelectorAll<HTMLElement>("[data-dot]")];
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    deck.dataset.ready = "";
    let current = 0;
    const rafs = new Set<number>();

    const count = (el: HTMLElement) => {
      const end = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals ?? 0);
      if (still) { el.textContent = fmt(end, decimals); return; }
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 1400);
        el.textContent = fmt(end * (1 - (1 - k) ** 3), decimals);
        if (k < 1) rafs.add(requestAnimationFrame(tick));
      };
      rafs.add(requestAnimationFrame(tick));
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (!e.isIntersecting) continue;
        const i = slides.indexOf(el);
        current = i;
        dots.forEach((d, j) => d.toggleAttribute("data-active", j === i));
        if (el.hasAttribute("data-in")) continue;
        el.setAttribute("data-in", "");
        el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
      }
    }, { threshold: 0.55 });
    slides.forEach((s) => io.observe(s));

    const go = (i: number) => slides[Math.max(0, Math.min(slides.length - 1, i))]?.scrollIntoView({ behavior: still ? "auto" : "smooth" });
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(current + 1); }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(current - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => { io.disconnect(); window.removeEventListener("keydown", onKey); rafs.forEach(cancelAnimationFrame); delete deck.dataset.ready; };
  }, []);
  return null;
}
