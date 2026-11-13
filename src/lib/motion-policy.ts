export type MotionPreference = "auto" | "full" | "lite";
export interface MotionSignals { reduced: boolean; cores?: number; memory?: number; saveData: boolean; narrow: boolean; connection?: string; slow: boolean }
export function resolveMotion(preference: MotionPreference, s: MotionSignals): { mode: "full" | "lite"; reason: string } {
  if (s.reduced) return {mode:"lite", reason:"Your device requests reduced motion."};
  if (s.saveData) return {mode:"lite", reason:"Data saving is enabled on your device."};
  if (preference === "lite") return {mode:"lite", reason:"Lite mode is selected."};
  if (s.slow) return {mode:"lite", reason:"Lite mode keeps this visit running smoothly."};
  if (preference === "full") return {mode:"full", reason:"Full effects are selected."};
  if (!(s.cores && s.cores > 4) || (s.memory !== undefined && s.memory <= 4) || s.narrow || ["slow-2g","2g","3g"].includes(s.connection ?? "")) return {mode:"lite", reason:"Auto selected lighter effects for this device."};
  return {mode:"full", reason:"Auto selected full effects for this device."};
}
export function shouldReduceForFrames(samples: number[]) {
  const valid = samples.filter((n) => Number.isFinite(n) && n > 0 && n < 250);
  return valid.length >= 45 && valid.filter((n) => n > 38).length / valid.length >= 0.7;
}
