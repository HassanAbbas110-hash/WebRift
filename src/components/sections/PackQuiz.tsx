"use client";

import Link from "next/link";
import { useState } from "react";
import { quizResult, packFigures, type QuizAnswers } from "@/lib/content";
import { formatZAR } from "@/lib/quote";
import { SectionHeading, section } from "./SectionHeading";

type Q<K extends keyof QuizAnswers> = { key: K; title: string; options: [QuizAnswers[K], string][] };
const QUESTIONS: [Q<"shop">, Q<"site">, Q<"pain">, Q<"budget">] = [
  { key: "shop", title: "What kind of shop do you run?", options: [["vape", "Vape shop"], ["other", "Another kind of shop"]] },
  { key: "site", title: "Do you have a website?", options: [["none", "No, just WhatsApp"], ["basic", "Something basic"], ["yes", "Yes, and it works"]] },
  { key: "pain", title: "What's your main headache?", options: [["found", "People can't find us"], ["orders", "Messy WhatsApp orders"], ["repeat", "Customers don't come back"], ["control", "Stock and cash control"]] },
  { key: "budget", title: "What setup budget feels right?", options: [["low", "Under R4,500"], ["mid", "R4,500 – R8,000"], ["high", "R8,000+"]] },
];

export function PackQuiz() {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const step = QUESTIONS.findIndex((q) => !answers[q.key]);
  const done = step === -1;
  const f = done ? packFigures(quizResult(answers as QuizAnswers)) : null;

  return (
    <section className={section}>
      <div className="card relative overflow-hidden p-6 sm:p-12">
        <div aria-hidden="true" className="absolute -bottom-32 -left-20 size-80 rounded-full bg-violet/25 blur-[100px]" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading eyebrow="30-second quiz" title={<>Which pack <span className="text-grad">fits me?</span></>} sub="Four quick taps and we'll point you to a starting pack. You can change anything in the quote." />
          <div aria-live="polite">
            <ol className="mb-6 flex gap-2" aria-label="Progress">
              {QUESTIONS.map((q, i) => (
                <li key={q.key} className={`h-1 flex-1 rounded-full ${done || i < step ? "bg-grad" : i === step ? "bg-cyan/40" : "bg-white/10"}`} />
              ))}
            </ol>
            {!done ? (
              <fieldset key={step}>
                <legend className="font-display text-2xl font-semibold">{QUESTIONS[step].title}</legend>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [QUESTIONS[step].key]: value }))}
                      className="rounded-2xl border border-line bg-white/[0.03] px-5 py-4 text-left font-medium transition hover:border-cyan/50 hover:bg-cyan/[0.06]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button type="button" onClick={() => setAnswers((a) => ({ ...a, [QUESTIONS[step - 1].key]: undefined }))} className="mt-5 text-sm text-muted hover:text-text">
                    ← Back
                  </button>
                )}
              </fieldset>
            ) : (
              f && (
                <div>
                  <p className="text-sm text-muted">Your best starting point:</p>
                  <p className="font-display mt-1 text-4xl font-bold">{f.pack.name}</p>
                  <p className="mt-2 text-muted">{f.pack.blurb}</p>
                  <p className="mt-4 text-lg">
                    <strong>{formatZAR(f.setup)}</strong> setup + {formatZAR(f.monthly)}/mo
                    <span className="ml-2 text-sm text-cyan">(you save {formatZAR(f.youSave)} in year 1)</span>
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link href={`/quote?pack=${f.pack.id}`} className="bg-grad rounded-full px-6 py-3 text-center font-semibold text-white">Build this quote →</Link>
                    <button type="button" onClick={() => setAnswers({})} className="rounded-full border border-line px-6 py-3 font-semibold hover:border-cyan/50">Start again</button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
