import { afterEach, describe, expect, it, vi } from "vitest";
import { clearFloor, createLead, createQuote, deleteLead, deleteQuote, getFloors, getQuote, listLeads, listQuotes, setFloor, validUntilFrom } from "@/lib/db";
import { computeQuote, type QuoteInput } from "@/lib/quote";

const input: QuoteInput = { packId: "vape-pro", productIds: [], extraIds: [], payment: "standard" };
const save = () => createQuote(input, computeQuote(input, {}));

describe("db helpers", () => {
  it("validUntil uses the Johannesburg date + 14 days", () => {
    expect(validUntilFrom(new Date("2026-11-11T22:00:00Z"))).toBe("2026-11-26");
  });
  it("vape-starter default floor is 3500", async () => {
    expect((await getFloors())["vape-starter"]).toBe(3500);
  });
  it("setFloor stores only overrides; defaults still merged on read", async () => {
    await setFloor("vape-pro", 6000);
    expect(await getFloors()).toMatchObject({ "vape-pro": 6000, "vape-starter": 3500 });
    await setFloor("vape-starter", 3000);
    expect((await getFloors())["vape-pro"]).toBe(6000);
  });
  it("clearFloor removes the override, back to catalogue default", async () => {
    await setFloor("vape-starter", 3000);
    await clearFloor("vape-starter");
    expect((await getFloors())["vape-starter"]).toBe(3500);
  });
});

describe("quote share tokens", () => {
  it("createQuote returns a 10-hex token; getQuote needs the right one", async () => {
    const { id, token } = await save();
    expect(token).toMatch(/^[0-9a-f]{10}$/);
    expect(await getQuote(id, token)).toMatchObject({ id, token });
    expect(await getQuote(id, "0000000000")).toBeNull();
    expect(await getQuote(id, "")).toBeNull();
    expect(await getQuote(id, token.slice(0, 9))).toBeNull();
  });
});

describe("deletes", () => {
  it("deleteQuote and deleteLead remove the row", async () => {
    const { id } = await save();
    const { id: lead } = await createLead({ source: "quote", name: "A", phone: "0817179974", consent: true });
    await deleteQuote(id);
    await deleteLead(lead);
    expect((await listQuotes()).some((q) => q.id === id)).toBe(false);
    expect((await listLeads()).some((l) => l.id === lead)).toBe(false);
  });
});

describe("production without a database", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("throws instead of falling back to memory", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    await expect(listQuotes()).rejects.toThrow("DATABASE_URL is required in production");
    await expect(save()).rejects.toThrow("DATABASE_URL is required in production");
  });
});
