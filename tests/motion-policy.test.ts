import { describe, expect, it } from "vitest";
import { resolveMotion, shouldReduceForFrames, type MotionSignals } from "@/lib/motion-policy";
const strong: MotionSignals = { reduced: false, cores: 8, memory: 8, saveData: false, narrow: false, connection: "4g", slow: false };
describe("adaptive motion policy", () => {
  it("enables full effects automatically on a capable desktop", () => expect(resolveMotion("auto", strong).mode).toBe("full"));
  it("respects the saved Lite choice on fast hardware", () => expect(resolveMotion("lite", strong).mode).toBe("lite"));
  it("never overrides reduced motion, even when Full is selected", () => expect(resolveMotion("full", {...strong, reduced:true}).mode).toBe("lite"));
  it("never overrides data saving", () => expect(resolveMotion("full", {...strong, saveData:true}).mode).toBe("lite"));
  it("uses Lite for limited or unknown CPU", () => { for (const cores of [undefined, 2, 4]) expect(resolveMotion("auto", {...strong, cores}).mode).toBe("lite"); });
  it("uses Lite for low memory and small screens", () => { expect(resolveMotion("auto", {...strong, memory:4}).mode).toBe("lite"); expect(resolveMotion("auto", {...strong, narrow:true}).mode).toBe("lite"); });
  it("uses Lite on slow networks", () => { for (const connection of ["slow-2g","2g","3g"]) expect(resolveMotion("auto", {...strong, connection}).mode).toBe("lite"); });
  it("does not penalise browsers that omit optional memory/network hints", () => expect(resolveMotion("auto", {...strong, memory:undefined, connection:undefined}).mode).toBe("full"));
  it("allows an explicit Full choice on weaker hardware but not sustained poor rendering", () => { expect(resolveMotion("full", {...strong, cores:2, narrow:true}).mode).toBe("full"); expect(resolveMotion("full", {...strong, slow:true}).mode).toBe("lite"); });
  it("does not downgrade from one slow frame or a hidden-tab pause", () => { expect(shouldReduceForFrames([40])).toBe(false); expect(shouldReduceForFrames([...Array(60).fill(16), 2000])).toBe(false); });
  it("downgrades sustained slow rendering but accepts a 30fps device", () => { expect(shouldReduceForFrames(Array(60).fill(45))).toBe(true); expect(shouldReduceForFrames(Array(60).fill(33.3))).toBe(false); });
});
