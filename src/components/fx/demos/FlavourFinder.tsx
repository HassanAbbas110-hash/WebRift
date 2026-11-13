"use client";

import { useEffect, useRef, useState } from "react";
import { FLAVOUR_QUESTIONS, pickFlavours, type FlavourAnswers } from "@/lib/fx";
import { OrderLink, appear, chip } from "./OrderLink";

export function FlavourFinder() {
  const [answers, setAnswers] = useState<Partial<FlavourAnswers>>({});
  const step = FLAVOUR_QUESTIONS.findIndex((q) => !answers[q.key]);
  const picks = step === -1 ? pickFlavours(answers as FlavourAnswers) : null;
  const heading = useRef<HTMLHeadingElement & HTMLLegendElement>(null);
  const moved = useRef(false);

  // Keep keyboard focus on the new question (or the result) after each tap, but not on first render.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
    moved.current = true;
  }, [step]);

  if (picks) {
    return (
      <div className={appear}>
        <h3 ref={heading} tabIndex={-1} className="font-display text-lg font-semibold outline-none">Your top 3</h3>
        <ol className="mt-3 space-y-2">
          {picks.map((f, i) => (
            <li key={f.name} style={{ animationDelay: `${i * 0.1}s` }} className={`${appear} flex items-center gap-3 rounded-xl border border-line bg-white/[0.04] p-3`}>
              <span className="bg-grad grid size-7 place-items-center rounded-full text-xs font-bold text-white">{i + 1}</span>
              <span className="text-sm font-medium">{f.name}</span>
              <span className="ml-auto text-xs text-muted">{answers.size}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 space-y-2">
          <OrderLink text={`Hi, please set aside: ${picks.map((f) => `${f.name} ${answers.size}`).join(", ")}`} />
          <button type="button" onClick={() => setAnswers({})} className="w-full rounded-xl border border-line py-2 text-sm text-muted hover:text-text">Start again</button>
        </div>
      </div>
    );
  }

  const q = FLAVOUR_QUESTIONS[step];
  return (
    <fieldset key={q.key} className={appear}>
      <legend ref={heading} tabIndex={-1} className="text-xs font-semibold tracking-widest text-muted uppercase outline-none">
        Question {step + 1} of {FLAVOUR_QUESTIONS.length}
        <span className="font-display mt-1 block text-lg font-semibold tracking-normal text-text normal-case">{q.title}</span>
      </legend>
      <div className="mt-3 grid gap-2">
        {q.options.map(([value, label]) => (
          <button key={value} type="button" className={chip(false)} onClick={() => setAnswers((a) => ({ ...a, [q.key]: value }))}>
            {label}
          </button>
        ))}
      </div>
      <ol aria-hidden="true" className="mt-4 flex gap-1.5">
        {FLAVOUR_QUESTIONS.map((x, i) => <li key={x.key} className={`h-1 flex-1 rounded-full ${i < step ? "bg-grad" : i === step ? "bg-cyan/40" : "bg-white/10"}`} />)}
      </ol>
    </fieldset>
  );
}
