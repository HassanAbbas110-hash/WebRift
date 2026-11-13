"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [err, setErr] = useState("");
  const router = useRouter();
  return (
    <form
      className="glass mt-6 space-y-4 rounded-2xl border border-line p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const password = new FormData(e.currentTarget).get("password");
        const r = await fetch("/api/auth", { method: "POST", body: JSON.stringify({ kind: "admin", password }) });
        if (r.ok) { router.push("/admin"); router.refresh(); }
        else setErr(r.status === 429 ? "Too many tries. Wait 15 minutes." : "Wrong password.");
      }}
    >
      <label className="block text-sm text-muted">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-text" />
      </label>
      {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
      <button className="bg-grad rounded-lg px-4 py-2 font-semibold text-bg">Sign in</button>
    </form>
  );
}
