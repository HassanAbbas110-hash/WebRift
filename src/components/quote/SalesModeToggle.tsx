"use client";
import { useEffect, useRef, useState } from "react";

export function SalesModeToggle() {
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const dlg = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    fetch("/api/auth").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => {});
  }, []);
  useEffect(() => {
    if (open) dlg.current?.showModal();
    else dlg.current?.close();
  }, [open]);

  if (role) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 px-2.5 py-0.5 text-cyan">
        Sales mode on
        <button
          className="underline"
          onClick={async () => {
            await fetch("/api/auth", { method: "DELETE" });
            setRole(null);
            location.reload();
          }}
        >
          Exit
        </button>
      </span>
    );
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="opacity-60 hover:text-cyan hover:opacity-100">Team</button>
      <dialog ref={dlg} onClose={() => setOpen(false)} className="m-auto rounded-2xl border border-line bg-panel p-6 text-text backdrop:bg-black/60">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const pin = new FormData(e.currentTarget).get("pin");
            const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ kind: "sales", pin }) });
            if (r.ok) {
              setOpen(false);
              setRole("sales");
              location.reload();
            } else setErr(r.status === 429 ? "Too many tries. Try later." : "Wrong PIN.");
          }}
        >
          <label className="block text-sm">
            Team PIN
            <input name="pin" type="password" inputMode="numeric" autoComplete="off" required className="mt-1 block w-full rounded-lg border border-line bg-bg px-3 py-2" />
          </label>
          {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-2">
            <button className="bg-grad rounded-lg px-4 py-2 font-semibold text-bg">Enter</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-muted">Cancel</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
