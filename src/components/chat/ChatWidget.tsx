"use client";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { waLink } from "@/lib/site";
import { ChatMessages } from "./ChatMessages";

const KEY = "wr-chat";
const MAX_CHARS = 1000;
const STARTERS = ["Which pack fits my shop?", "What does Vape Pro include?", "How does pricing work?", "Do you do Google Maps?"];

const load = (): UIMessage[] => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? "[]"); } catch { return []; }
};

export function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [initial] = useState(load);
  const { messages, sendMessage, status, error, setMessages, clearError, stop } = useChat({ messages: initial });
  const [input, setInput] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (busy) return; // save settled history only
    try { sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-40))); } catch { /* storage blocked */ }
  }, [messages, busy]);
  useEffect(() => { if (open) field.current?.focus(); }, [open]);

  const send = (text: string) => {
    const t = text.trim().slice(0, MAX_CHARS);
    if (!t || busy) return;
    clearError();
    sendMessage({ text: t });
    setInput("");
  };
  const clear = () => {
    stop();
    clearError();
    setMessages([]);
    try { sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
    field.current?.focus();
  };

  // Escape closes; Tab stays inside the dialog.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab" || !box.current) return;
    const f = [...box.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea:not([disabled])")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const limited = error?.message.includes("Too many");

  return (
    <div
      ref={box}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wr-chat-title"
      hidden={!open}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] flex flex-col border-line bg-panel sm:inset-auto sm:right-5 sm:bottom-40 sm:h-[min(560px,calc(100dvh-12rem))] sm:w-[380px] sm:rounded-2xl sm:border sm:shadow-2xl"
    >
      <header className="flex items-center gap-2 border-b border-line px-4 py-3">
        <h2 id="wr-chat-title" className="font-display flex-1 font-semibold">WebRift assistant</h2>
        <button type="button" onClick={clear} className="rounded-lg px-2 py-1 text-xs text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-cyan">Clear chat</button>
        <button type="button" onClick={onClose} aria-label="Close chat" className="grid size-8 place-items-center rounded-lg text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-cyan">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3" aria-live="polite">
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-muted">Hi! Ask me about packs, prices or getting your shop online.</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-cyan/50 focus-visible:outline-2 focus-visible:outline-cyan">{s}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ChatMessages messages={messages} busy={status === "submitted"} />
        {error && (
          <div role="alert" className="mt-3 rounded-xl border border-line bg-white/[0.04] p-3 text-sm">
            <p>{limited ? "That's a lot of messages. Try again in a few minutes, or message us on WhatsApp." : "The assistant is offline right now — message us on WhatsApp"}</p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block rounded-full bg-[#25d366] px-3 py-1.5 font-semibold text-black focus-visible:outline-2 focus-visible:outline-cyan">Message us on WhatsApp</a>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-line p-3">
        <label htmlFor="wr-chat-input" className="sr-only">Your message</label>
        <textarea
          id="wr-chat-input"
          ref={field}
          rows={1}
          value={input}
          maxLength={MAX_CHARS}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Type your question…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm placeholder:text-muted/60 focus:border-cyan focus:outline-none"
        />
        <button type="submit" disabled={busy || !input.trim()} className="bg-grad rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-cyan">Send</button>
      </form>
      <p className="px-4 pb-3 text-xs text-muted">
        Chats aren&apos;t stored unless you agree. See <Link href="/privacy" className="underline hover:text-text">Privacy</Link>.
      </p>
    </div>
  );
}
