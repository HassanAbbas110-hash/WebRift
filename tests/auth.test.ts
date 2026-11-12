import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sign, verify } from "@/lib/auth";

describe("auth tokens", () => {
  beforeEach(() => { process.env.AUTH_SECRET = "test-secret"; });
  afterEach(() => { vi.useRealTimers(); delete process.env.AUTH_SECRET; });

  it("round-trips roles", () => {
    expect(verify(sign("admin", 7))).toBe("admin");
    expect(verify(sign("sales", 30))).toBe("sales");
  });
  it("rejects a tampered token", () => {
    const t = sign("admin", 7);
    const bad = t.slice(0, -1) + (t.endsWith("A") ? "B" : "A");
    expect(verify(bad)).toBeNull();
  });
  it("rejects an expired token", () => {
    vi.useFakeTimers();
    const t = sign("admin", 7);
    vi.setSystemTime(Date.now() + 8 * 864e5);
    expect(verify(t)).toBeNull();
  });
  it("rejects undefined and garbage", () => {
    expect(verify(undefined)).toBeNull();
    expect(verify("a.b")).toBeNull();
  });
  it("without a secret: verify null, sign throws", () => {
    const t = sign("admin", 7);
    delete process.env.AUTH_SECRET;
    expect(verify(t)).toBeNull();
    expect(() => sign("admin", 7)).toThrow();
  });
});
