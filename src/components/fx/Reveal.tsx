"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";

/** Fade-and-rise once on scroll into view. Reduced motion keeps only the fade. data-reveal un-hides it when JS is off (globals.css). */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          data-reveal
          className={className}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
