"use client";

import Link from "next/link";
import { useState } from "react";
import { waLink } from "@/lib/site";

const field = "mt-1.5 block w-full rounded-xl border border-line bg-bg/80 px-4 py-3 text-text placeholder:text-muted/60 focus:border-cyan focus:outline-none";

export function HealthCheckForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [shop, setShop] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const opt = (k: string) => String(f.get(k) ?? "").trim() || undefined;
    setShop(opt("shop") ?? "");
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "health-check",
          name: opt("name"),
          phone: opt("phone"),
          shop: opt("shop"),
          area: opt("area"),
          summary: "Free Business Health Check request",
          consent: f.get("consent") === "on",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card p-8 text-center" role="status">
        <p className="text-grad font-display text-3xl font-bold">Request received.</p>
        <p className="mt-3 text-muted">We&apos;ll be in touch on WhatsApp. Want to speed things up? Send us a message now.</p>
        <a
          href={waLink(`Hi WebRift, I just requested a free Health Check${shop ? ` for ${shop}` : ""}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-[#25d366] px-7 py-3.5 font-semibold text-white transition hover:brightness-110"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold">Get your free Health Check</h2>
      <label className="block text-sm font-medium">
        Your name
        <input name="name" required maxLength={80} autoComplete="name" className={field} />
      </label>
      <label className="block text-sm font-medium">
        WhatsApp number
        {/* Browser check for the obvious mistakes; the server does the exact validation. */}
        <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" pattern="\+?[\d ]{9,20}" placeholder="060 123 4567" title="Digits only, e.g. 060 123 4567" className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Shop name <span className="font-normal text-muted">(optional)</span>
          <input name="shop" maxLength={80} autoComplete="organization" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Area <span className="font-normal text-muted">(optional)</span>
          <input name="area" maxLength={80} placeholder="e.g. Rustenburg CBD" className={field} />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input name="consent" type="checkbox" required className="mt-1 size-4 accent-cyan" />
        <span>
          I agree that WebRift may store my details to follow up on this request, as set out in the{" "}
          <Link href="/privacy" className="text-cyan underline">privacy notice</Link>.
        </span>
      </label>
      {state === "error" && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm">
          That didn&apos;t go through. Check your number, or{" "}
          <a href={waLink("Hi WebRift, I'd like a free Health Check for my shop.")} target="_blank" rel="noopener noreferrer" className="underline">message us on WhatsApp</a> instead.
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="bg-grad w-full rounded-full px-6 py-3.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Request my free Health Check"}
      </button>
    </form>
  );
}
