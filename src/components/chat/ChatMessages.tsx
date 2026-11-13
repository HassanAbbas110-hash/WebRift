"use client";
import type { UIMessage } from "ai";
import Link from "next/link";

type ToolPart = { type: string; state?: string; output?: Record<string, unknown> };

const card = "mt-2 rounded-xl border border-cyan/30 bg-cyan/[0.06] p-3 text-sm";
const btn = "mt-2 inline-block rounded-full px-3 py-1.5 font-semibold focus-visible:outline-2 focus-visible:outline-cyan";

function ToolCard({ part }: { part: ToolPart }) {
  if (part.state !== "output-available" || !part.output) return null;
  const o = part.output as { name?: string; reason?: string; quoteUrl?: string; ok?: boolean; whatsappUrl?: string };
  const quote = typeof o.quoteUrl === "string" && o.quoteUrl.startsWith("/quote") ? o.quoteUrl : null;

  if (part.type === "tool-recommendPack" && quote) return (
    <div className={card}>
      <p className="text-xs tracking-wide text-cyan uppercase">Recommended pack</p>
      <p className="font-display mt-1 font-semibold">{o.name}</p>
      <p className="mt-1 text-muted">{o.reason}</p>
      <Link href={quote} className={`${btn} bg-grad text-white`}>Open quote</Link>
    </div>
  );
  if (part.type === "tool-openQuote" && quote) return (
    <div className={card}>
      <p>Your quote is ready to review and adjust.</p>
      <Link href={quote} className={`${btn} bg-grad text-white`}>Open quote</Link>
    </div>
  );
  if (part.type === "tool-saveLead" && o.ok && typeof o.whatsappUrl === "string" && o.whatsappUrl.startsWith("https://wa.me/")) return (
    <div className={card}>
      <p className="font-semibold">Thanks! The WebRift team will follow up.</p>
      <p className="mt-1 text-xs text-muted">Shared with the WebRift team with your permission</p>
      <a href={o.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25d366] text-black`}>Send to WebRift on WhatsApp</a>
    </div>
  );
  return null;
}

export function ChatMessages({ messages, busy }: { messages: UIMessage[]; busy: boolean }) {
  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
          <div className={m.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-sm bg-blue/80 px-3 py-2 text-sm text-white" : "max-w-[95%] text-sm"}>
            <span className="sr-only">{m.role === "user" ? "You:" : "Assistant:"}</span>
            {m.parts.map((p, i) =>
              p.type === "text" ? <p key={i} className="whitespace-pre-wrap">{p.text}</p> : <ToolCard key={i} part={p as ToolPart} />,
            )}
          </div>
        </li>
      ))}
      {busy && (
        <li aria-label="Assistant is typing" className="flex gap-1 py-1">
          {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-muted motion-safe:animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />)}
        </li>
      )}
    </ul>
  );
}
