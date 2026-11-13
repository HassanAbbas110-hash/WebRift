"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

// The chat (and the AI SDK) loads only when the visitor first opens it.
const ChatWidget = dynamic(() => import("./ChatWidget").then((m) => m.ChatWidget), { ssr: false });

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); btn.current?.focus(); };

  return (
    <div data-chat>
      <button
        ref={btn}
        type="button"
        data-chat-launcher
        aria-label="Ask the WebRift assistant"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => { setLoaded(true); setOpen((o) => !o); }}
        className="bg-grad fixed right-5 bottom-24 z-50 grid size-14 place-items-center rounded-full text-white shadow-[0_8px_30px_-6px_rgba(59,130,246,0.7)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
        </svg>
      </button>
      {loaded && <ChatWidget open={open} onClose={close} />}
    </div>
  );
}
