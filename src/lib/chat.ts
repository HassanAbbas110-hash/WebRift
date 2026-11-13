// Pure chat helpers shared by the widget (client) and the chat route (server).
import type { UIMessage } from "ai";

export const MAX_MESSAGES = 40, MAX_USER_CHARS = 1000, MAX_ASSISTANT_CHARS = 16_000, MAX_TOTAL_CHARS = 60_000, MAX_LINE_CHARS = 2000;

export type TranscriptLine = { role: "user" | "assistant"; text: string };
export type LeadProposal = { name: string; phone: string; shop?: string; summary: string; intent: number };

export const textOf = (m: Pick<UIMessage, "parts">) => m.parts.flatMap((p) => (p.type === "text" ? [p.text] : [])).join("\n");

/** User/assistant text only, last 40 lines, each line capped. */
export const transcriptOf = (messages: UIMessage[]): TranscriptLine[] =>
  messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as TranscriptLine["role"], text: textOf(m).slice(0, MAX_LINE_CHARS) }))
    .filter((l) => l.text)
    .slice(-MAX_MESSAGES);

/** What the widget sends: the last 40 messages, oldest dropped until the text fits the server's total cap. */
export function recentMessages(messages: UIMessage[]): UIMessage[] {
  const out = messages.slice(-MAX_MESSAGES);
  let total = out.reduce((n, m) => n + textOf(m).length, 0);
  while (out.length > 1 && total > MAX_TOTAL_CHARS) total -= textOf(out.shift()!).length;
  return out;
}

/** POST body for /api/leads once the visitor ticks consent on the confirm card. */
export function leadPayload(p: LeadProposal, messages: UIMessage[]) {
  return {
    source: "chat" as const,
    name: p.name.trim(), phone: p.phone.trim(), shop: p.shop?.trim() || undefined,
    summary: p.summary, intent: p.intent,
    transcript: transcriptOf(messages),
    consent: true as const,
  };
}
