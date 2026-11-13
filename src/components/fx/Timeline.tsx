import { Reveal } from "./Reveal";

type Step = { when: string; title: string; body: string };

/**
 * Delivery timeline. The gradient line draws with scroll via CSS scroll-driven animation (.timeline-line in globals.css):
 * no JS, off the main thread. Browsers without it, and reduced motion, show the line fully drawn.
 */
export function Timeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative mt-14 grid gap-6 md:grid-cols-5 md:gap-4">
      <span
        aria-hidden="true"
        className="timeline-line absolute top-5 bottom-5 left-5 w-px origin-top bg-[image:var(--grad)] shadow-[0_0_12px_var(--cyan)] [--grow-y:0] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto md:origin-left md:[--grow-x:0] md:[--grow-y:1]"
      />
      {steps.map((s, i) => (
        <li key={s.when}>
          <Reveal delay={i * 0.08} className="relative pl-16 md:pt-16 md:pl-0">
            <span className="bg-grad absolute top-0 left-0 grid size-10 place-items-center rounded-full font-bold text-white shadow-[0_0_24px_-2px_rgba(59,130,246,0.8)]">{i + 1}</span>
            <p className="text-xs font-semibold tracking-widest text-cyan uppercase">{s.when}</p>
            <h3 className="font-display mt-1 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted">{s.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
