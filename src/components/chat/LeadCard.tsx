"use client";
import type { UIMessage } from "ai";
import Link from "next/link";
import { useId, useState } from "react";
import { leadPayload, type LeadProposal } from "@/lib/chat";
import { waLink } from "@/lib/site";

export type LeadOutcome = { status: "shared" | "declined"; name?: string; shop?: string };

const card = "mt-2 rounded-xl border border-cyan/30 bg-cyan/[0.06] p-3 text-sm";
const input = "mt-1 block w-full rounded-lg border border-line bg-bg px-2 py-1.5 text-text focus:border-cyan focus:outline-none";
const btn = "rounded-full px-3 py-1.5 font-semibold focus-visible:outline-2 focus-visible:outline-cyan";

/** Nothing is stored until the visitor ticks the box and presses Share (POPIA consent). */
export function LeadCard({ proposal, outcome, messages, onDone }: {
  proposal: LeadProposal; outcome?: LeadOutcome; messages: UIMessage[]; onDone: (o: LeadOutcome) => void;
}) {
  const id = useId();
  const [f, setF] = useState({ name: proposal.name, phone: proposal.phone, shop: proposal.shop ?? "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (outcome?.status === "declined") return <p className={card}>No problem — nothing was saved.</p>;
  if (outcome?.status === "shared") return (
    <div className={card}>
      <p className="font-semibold">Thanks! The WebRift team will follow up.</p>
      <p className="mt-1 text-xs text-muted">Shared with the WebRift team with your permission</p>
      <a href={waLink(`Hi WebRift, I'm ${outcome.name ?? proposal.name}${outcome.shop ? ` from ${outcome.shop}` : ""}. ${proposal.summary}`)} target="_blank" rel="noopener noreferrer" className={`${btn} mt-2 inline-block bg-[#25d366] text-black`}>Send to WebRift on WhatsApp</a>
    </div>
  );

  const share = async () => {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(leadPayload({ ...proposal, ...f }, messages)) });
      if (!res.ok) throw new Error();
      onDone({ status: "shared", name: f.name.trim(), shop: f.shop.trim() || undefined });
    } catch {
      setErr("That didn't go through. Check your name and number, or message us on WhatsApp.");
    } finally { setBusy(false); }
  };
  const field = (k: keyof typeof f, label: string, type = "text") => (
    <label className="mt-2 block text-xs text-muted">{label}
      <input type={type} value={f[k]} maxLength={80} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={input} />
    </label>
  );

  return (
    <form className={card} onSubmit={(e) => { e.preventDefault(); if (agree) share(); }}>
      <p className="font-semibold">Share this chat with WebRift?</p>
      <p className="mt-1 text-xs text-muted">{proposal.summary}</p>
      {field("name", "Name")}
      {field("phone", "WhatsApp number", "tel")}
      {field("shop", "Shop (optional)")}
      <div className="mt-3 flex items-start gap-2">
        <input id={id} type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-cyan" />
        <label htmlFor={id} className="text-xs">
          I agree that WebRift may store this chat and my details to follow up. <Link href="/privacy" className="underline">Privacy</Link>
        </label>
      </div>
      {err && <p role="alert" className="mt-2 text-xs text-red-300">{err}</p>}
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={!agree || busy} className={`${btn} bg-grad text-white disabled:opacity-50`}>{busy ? "Sharing…" : "Share with WebRift"}</button>
        <button type="button" onClick={() => onDone({ status: "declined" })} className={`${btn} border border-line`}>No thanks</button>
      </div>
    </form>
  );
}
