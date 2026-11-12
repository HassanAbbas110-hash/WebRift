import { beforeEach, describe, expect, it, vi } from "vitest";

const role = vi.hoisted(() => ({ value: null as "sales" | "admin" | null }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("@/lib/auth", async (orig) => ({ ...(await orig<typeof import("@/lib/auth")>()), getRole: async () => role.value }));
vi.mock("@/lib/db", () => ({ updateStatus: vi.fn(), setFloor: vi.fn(), getFloors: vi.fn() }));

import { GET, POST, DELETE } from "@/app/api/auth/route";
import { assertAdmin } from "@/lib/admin";

let n = 0;
const post = (body: unknown, ip = `1.1.1.${++n}`) =>
  POST(new Request("http://x/api/auth", { method: "POST", body: JSON.stringify(body), headers: { "x-forwarded-for": ip } }));

beforeEach(() => {
  process.env.AUTH_SECRET = "s"; process.env.SALES_PIN = "1234"; process.env.ADMIN_PASSWORD = "hunter2";
  role.value = null;
});

describe("/api/auth", () => {
  it("correct pin sets wr_auth", async () => {
    const res = await post({ kind: "sales", pin: "1234" });
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toMatch(/wr_auth=.*HttpOnly/i);
  });
  it("admin password works, wrong is 401", async () => {
    expect((await post({ kind: "admin", password: "hunter2" })).status).toBe(200);
    expect((await post({ kind: "admin", password: "nope" })).status).toBe(401);
  });
  it("wrong pin is 401, 6th wrong from same IP is 429", async () => {
    for (let i = 0; i < 5; i++) expect((await post({ kind: "sales", pin: "0000" }, "9.9.9.9")).status).toBe(401);
    expect((await post({ kind: "sales", pin: "0000" }, "9.9.9.9")).status).toBe(429);
  });
  it("unset SALES_PIN is 401 even for empty pin", async () => {
    delete process.env.SALES_PIN;
    expect((await post({ kind: "sales", pin: "" })).status).toBe(401);
  });
  it("GET returns role", async () => {
    role.value = "sales";
    expect(await (await GET()).json()).toEqual({ role: "sales" });
  });
  it("DELETE clears cookie", async () => {
    expect((await DELETE()).headers.get("set-cookie")).toMatch(/wr_auth=;|Max-Age=0/i);
  });
});

describe("assertAdmin", () => {
  it("rejects non-admin", async () => {
    role.value = "sales";
    await expect(assertAdmin()).rejects.toThrow();
    role.value = null;
    await expect(assertAdmin()).rejects.toThrow();
  });
  it("passes admin", async () => {
    role.value = "admin";
    await expect(assertAdmin()).resolves.toBeUndefined();
  });
});
