"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { COMPARE_COLS, OVERALL } from "@/lib/content";

export function RatingBars() {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ul className="space-y-4">
          {COMPARE_COLS.map((c, i) => {
            const us = i === COMPARE_COLS.length - 1;
            return (
              <li key={c} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm sm:grid-cols-[9rem_1fr_3rem]">
                <span className={us ? "font-semibold" : "text-muted"}>{c}</span>
                <span className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <m.span
                    data-reveal
                    className={`block h-full origin-left rounded-full ${us ? "bg-grad" : "bg-white/25"}`}
                    style={{ width: `${OVERALL[i] * 10}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className={`text-right tabular-nums ${us ? "text-grad font-bold" : "text-muted"}`}>{OVERALL[i].toFixed(1)}</span>
              </li>
            );
          })}
        </ul>
      </MotionConfig>
    </LazyMotion>
  );
}
