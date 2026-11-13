import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  createQuote: vi.fn(async (..._a: unknown[]) => ({ id: "WR-2026-0001", validUntil: "2026-11-26" })),
  createLead: vi.fn(async (..._a: unknown[]) => ({ id: "lead-1" })),
  getFloors: vi.fn(async () => ({ "vape-starter": 3500 }) as Record<string, number>),
}));
const role = vi.hoisted(() => ({ value: null as "sales" | "admin" | null }));
vi.mock("@/lib/db", () => db);
vi.mock("@/lib/auth", () => ({ getRole: async () => role.value }));

import { POST as postQuote } from "@/app/api/quotes/route";
import { POST as postLead } from "@/app/api/leads/route";

const req = (body: unknown) =>
  new Request("http://x/api", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const qc = () => db.createQuote.mock.calls[0] as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lc = () => db.createLead.mock.calls[0] as any[];

beforeEach(() => { vi.clearAllMocks(); role.value = null; });

describe("POST /api/quotes", () => {
  it("ignores client totals and stores server-computed ones", async () => {
    const res = await postQuote(req({ input: { packId: "vape-pro", payment: "standard" }, totals: { setup: 1 } }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: "WR-2026-0001", url: "/q/WR-2026-0001", validUntil: "2026-11-26" });
    expect(qc()[1].setup).toBe(7000);
  });
  it("400s on an empty quote", async () => {
    const res = await postQuote(req({ input: { payment: "standard" } }));
    expect(res.status).toBe(400);
    expect(db.createQuote).not.toHaveBeenCalled();
  });
  it("strips setupDiscount without a sales cookie", async () => {
    await postQuote(req({ input: { packId: "vape-starter", payment: "standard", setupDiscount: 3000 } }));
    expect(qc()[1].discountApplied).toBe(0);
  });
  it("honours discount for sales and records negotiated", async () => {
    role.value = "sales";
    await postQuote(req({ input: { packId: "vape-starter", payment: "standard", setupDiscount: 3000 } }));
    expect(qc()[1].discountApplied).toBe(500);
    expect(qc()[2]).toMatchObject({ negotiated: true });
  });
  it("stores a trimmed marketer name only for a sales role on a negotiated quote", async () => {
    role.value = "sales";
    await postQuote(req({ input: { packId: "vape-starter", payment: "standard", setupDiscount: 500 }, marketer: "  Thabo " }));
    expect(qc()[2]).toMatchObject({ marketer: "Thabo", negotiated: true });
    vi.clearAllMocks(); role.value = null;
    await postQuote(req({ input: { packId: "vape-starter", payment: "standard", setupDiscount: 500 }, marketer: "Thabo" }));
    expect(qc()[2].marketer).toBeUndefined();
  });
  it("400s on an over-long marketer", async () => {
    expect((await postQuote(req({ input: { packId: "vape-pro", payment: "standard" }, marketer: "x".repeat(41) }))).status).toBe(400);
  });
  it("400s on unknown-only ids", async () => {
    const res = await postQuote(req({ input: { productIds: ["bogus"], payment: "standard" } }));
    expect(res.status).toBe(400);
    expect(db.createQuote).not.toHaveBeenCalled();
  });
  it("strips customLines without a role", async () => {
    await postQuote(req({ input: { packId: "vape-pro", payment: "standard", customLines: [{ label: "x", setup: 100, monthly: 0 }] } }));
    expect(qc()[1].setup).toBe(7000);
    expect(qc()[2].negotiated).toBeFalsy();
  });
  it("requires consent when client details are given", async () => {
    const body = { input: { packId: "vape-pro", payment: "standard" }, client: { name: "A", phone: "081 717 9974", consent: false } };
    expect((await postQuote(req(body))).status).toBe(400);
    body.client.consent = true;
    expect((await postQuote(req(body))).status).toBe(200);
  });
  it("400s on bad phone / malformed JSON", async () => {
    const body = { input: { packId: "vape-pro", payment: "standard" }, client: { name: "A", phone: "abc", consent: true } };
    expect((await postQuote(req(body))).status).toBe(400);
    expect((await postQuote(new Request("http://x", { method: "POST", body: "{" }))).status).toBe(400);
  });
});

describe("POST /api/leads", () => {
  it("400s without literal consent and does not save", async () => {
    const res = await postLead(req({ source: "quote", name: "A", phone: "0817179974", consent: false }));
    expect(res.status).toBe(400);
    expect(db.createLead).not.toHaveBeenCalled();
  });
  it("saves a consented lead, folding area into summary", async () => {
    const res = await postLead(req({ source: "health-check", name: "A", phone: "0817179974", area: "Durban", consent: true }));
    expect(res.status).toBe(200);
    expect(lc()[0]).toMatchObject({ source: "health-check", consent: true });
    expect(lc()[0].summary).toContain("Durban");
  });
  const chat = { source: "chat", name: "Sam", phone: "060 000 0000", shop: "Cloud 9", summary: "Wants Vape Pro", intent: 5, transcript: [{ role: "user", text: "hi" }, { role: "assistant", text: "hello" }], consent: true };
  it("saves a consented chat lead with its transcript", async () => {
    expect((await postLead(req(chat))).status).toBe(200);
    expect(lc()[0]).toEqual({ source: "chat", name: "Sam", phone: "060 000 0000", shop: "Cloud 9", summary: "Wants Vape Pro", intent: 5, transcript: chat.transcript, consent: true });
  });
  it("400s a chat lead without consent or with an oversized transcript", async () => {
    for (const body of [
      { ...chat, consent: false }, { ...chat, consent: undefined },
      { ...chat, transcript: Array.from({ length: 41 }, () => ({ role: "user", text: "x" })) },
      { ...chat, transcript: [{ role: "user", text: "x".repeat(2001) }] },
      { ...chat, transcript: [{ role: "system", text: "x" }] },
      { ...chat, intent: 6 },
    ]) expect((await postLead(req(body))).status).toBe(400);
    expect(db.createLead).not.toHaveBeenCalled();
  });
});
