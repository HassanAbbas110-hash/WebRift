"use client";
import { setMotionPreference, useMotionMode } from "./motion-store";
import type { MotionPreference } from "@/lib/motion-policy";
export function MotionControls() {
  const state = useMotionMode();
  return <div title={state.reason} className="motion-controls flex items-center gap-2 rounded-full border border-line bg-bg/70 px-2.5 py-1.5">
    <span aria-hidden="true" className={`size-1.5 rounded-full ${state.mode === "full" ? "bg-cyan" : "bg-muted"}`} />
    <label htmlFor="motion-mode" className="sr-only">Animation mode</label>
    <select id="motion-mode" value={state.preference} onChange={(e) => setMotionPreference(e.target.value as MotionPreference)} aria-describedby="motion-explanation" className="max-w-[6.5rem] cursor-pointer bg-transparent text-[11px] text-muted outline-offset-2 focus-visible:outline-cyan">
      <option value="auto">Auto · {state.mode === "full" ? "Full" : "Lite"}</option><option value="full" disabled={state.locked}>{state.preference === "full" && state.mode === "lite" ? "Full · Lite active" : "Full effects"}</option><option value="lite">Lite mode</option>
    </select>
    <span id="motion-explanation" role="status" className="sr-only">{state.reason}</span>
  </div>;
}
