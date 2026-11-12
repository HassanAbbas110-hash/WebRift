// Task 8 replaces this with the scroll story (a messy chat turning into a tidy order).
import { SectionHeading, section } from "./SectionHeading";

const MESSY = ["hi do u have the blue one", "how much", "can u deliver?? im in town", "which one again", "ok wait send pics"];
const TIDY: [string, string][] = [
  ["Order", "#1042 · Click & Collect"],
  ["Items", "3 items, total shown"],
  ["Collect", "Today, 16:30"],
  ["Note", "ID required at handover"],
];

export function ScrollStorySection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Before → after"
        title={<>From messy chats to <span className="text-grad">tidy orders.</span></>}
        sub="Your customers keep using WhatsApp. You stop playing 20 questions."
      />
      <div className="mt-14 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="card p-6">
          <p className="text-xs font-semibold tracking-widest text-muted uppercase">Before</p>
          <ul className="mt-4 space-y-2">
            {MESSY.map((m) => (
              <li key={m} className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-2 text-sm">{m}</li>
            ))}
          </ul>
        </div>
        <span aria-hidden="true" className="text-grad font-display mx-auto rotate-90 text-4xl font-bold md:rotate-0">→</span>
        <div className="card border-cyan/40 p-6 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.45)]">
          <p className="text-xs font-semibold tracking-widest text-cyan uppercase">After</p>
          <dl className="mt-4 divide-y divide-line rounded-2xl bg-white/[0.04] p-4 text-sm">
            {TIDY.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
