"use client";
import { useSyncExternalStore } from "react";
import { resolveMotion, shouldReduceForFrames, type MotionPreference } from "@/lib/motion-policy";
const KEY = "wr_motion_preference";
interface Connection extends EventTarget { saveData?: boolean; effectiveType?: string }
type DeviceNavigator = Navigator & { deviceMemory?: number; connection?: Connection };
interface Snapshot { preference: MotionPreference; mode: "full" | "lite"; reason: string; locked: boolean }
const server: Snapshot = {preference:"auto",mode:"lite",reason:"Effects adapt to your device.",locked:false};
let state = server;
let preference: MotionPreference = "auto";
let started = false;
let slow = false;
const listeners = new Set<() => void>();
const validPreference = (value: string | null): MotionPreference => value === "full" || value === "lite" ? value : "auto";
function refresh() {
  const nav = navigator as DeviceNavigator;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = nav.connection?.saveData === true;
  const result = resolveMotion(preference, {reduced, saveData, cores:nav.hardwareConcurrency, memory:nav.deviceMemory, narrow:matchMedia("(max-width: 899px)").matches, connection:nav.connection?.effectiveType, slow});
  const next = {preference, ...result, locked:reduced || saveData};
  document.documentElement.dataset.motion = next.mode;
  if (JSON.stringify(next) !== JSON.stringify(state)) { state = next; listeners.forEach((f) => f()); }
}
function start() {
  if (started) return;
  started = true;
  try { preference = validPreference(localStorage.getItem(KEY)); } catch { /* Memory-only preference works when storage is blocked. */ }
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", refresh);
  matchMedia("(max-width: 899px)").addEventListener("change", refresh);
  (navigator as DeviceNavigator).connection?.addEventListener("change", refresh);
  window.addEventListener("storage", (e) => { if (e.key === KEY || e.key === null) { preference = validPreference(e.newValue); slow = false; refresh(); } });
  window.addEventListener("pageshow", refresh);
  // Sample only while the user is scrolling; there is no idle animation loop.
  let raf = 0, lastScroll = 0, previous = 0;
  let samples: number[] = [];
  const sample = (now: number) => {
    raf = 0;
    if (document.hidden || state.mode !== "full" || now - lastScroll > 300) { samples = []; previous = 0; return; }
    if (previous) samples.push(now - previous);
    previous = now;
    if (samples.length >= 60) {
      if (shouldReduceForFrames(samples)) { slow = true; refresh(); }
      samples = []; previous = 0;
    }
    if (state.mode === "full") raf = requestAnimationFrame(sample);
  };
  window.addEventListener("scroll", () => { lastScroll = performance.now(); if (!raf && state.mode === "full" && !document.hidden) raf = requestAnimationFrame(sample); }, {passive:true});
  refresh();
}
function subscribe(listener: () => void) { listeners.add(listener); start(); return () => { listeners.delete(listener); }; }
export function useMotionMode() { return useSyncExternalStore(subscribe, () => state, () => server); }
export function setMotionPreference(next: MotionPreference) { start(); preference = next; slow = false; try { localStorage.setItem(KEY,next); } catch {} refresh(); }
