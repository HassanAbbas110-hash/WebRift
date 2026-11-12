import { neon } from "@neondatabase/serverless";
import { packs, type Pack } from "@/data/catalogue";
import type { QuoteInput, QuoteTotals } from "@/lib/quote";

export type QuoteMeta = {
  client?: { name: string; phone: string; shop?: string };
  marketer?: string;
  negotiated?: boolean;
};
export type QuoteRow = {
  id: string; seq: number; created_at: string; valid_until: string;
  input: QuoteInput; totals: QuoteTotals;
  client_name: string | null; client_phone: string | null; shop_name: string | null;
  marketer: string | null; negotiated: boolean; status: string;
};
export type LeadInput = {
  source: "chat" | "health-check" | "quote";
  name?: string; phone?: string; shop?: string; summary?: string;
  intent?: number; transcript?: unknown; consent: boolean;
};
export type LeadRow = LeadInput & { id: string; created_at: string; status: string };
type Table = "quotes" | "leads";
type Floors = Partial<Record<Pack["id"], number>>;

// shortcut: without DATABASE_URL everything lives in this in-memory store (lost on restart); upgrade once the Marketplace DB is linked.
type Mem = { quotes: QuoteRow[]; leads: LeadRow[]; settings: Map<string, unknown>; seq: number };
const g = globalThis as { __wrMem?: Mem };
const mem: Mem = (g.__wrMem ??= { quotes: [], leads: [], settings: new Map(), seq: 0 });
const sql = () => (process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null);

const jhb = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(d); // YYYY-MM-DD
export const validUntilFrom = (d = new Date()) => {
  const [y, m, day] = jhb(d).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day + 14)).toISOString().slice(0, 10);
};

export async function createQuote(input: QuoteInput, totals: QuoteTotals, meta: QuoteMeta = {}) {
  const now = new Date(), year = jhb(now).slice(0, 4), validUntil = validUntilFrom(now);
  const c = meta.client;
  const db = sql();
  if (!db) {
    const seq = ++mem.seq, id = `WR-${year}-${String(seq).padStart(4, "0")}`;
    mem.quotes.push({
      id, seq, created_at: now.toISOString(), valid_until: validUntil, input, totals,
      client_name: c?.name ?? null, client_phone: c?.phone ?? null, shop_name: c?.shop ?? null,
      marketer: meta.marketer ?? null, negotiated: !!meta.negotiated, status: "new",
    });
    return { id, validUntil };
  }
  // One statement: nextval feeds both seq and id, so it is atomic.
  const rows = await db`
    with n as (select nextval(pg_get_serial_sequence('quotes', 'seq')) as s)
    insert into quotes (id, seq, valid_until, input, totals, client_name, client_phone, shop_name, marketer, negotiated)
    select 'WR-' || ${year}::text || '-' || case when n.s < 10000 then lpad(n.s::text, 4, '0') else n.s::text end, n.s, ${validUntil}::date,
      ${JSON.stringify(input)}::jsonb, ${JSON.stringify(totals)}::jsonb,
      ${c?.name ?? null}, ${c?.phone ?? null}, ${c?.shop ?? null}, ${meta.marketer ?? null}, ${!!meta.negotiated}
    from n returning id`;
  return { id: rows[0].id as string, validUntil };
}

// neon returns timestamptz as Date; normalise so both paths give an ISO string.
const iso = (r: QuoteRow): QuoteRow => ({ ...r, created_at: new Date(r.created_at).toISOString() });

export async function getQuote(id: string): Promise<QuoteRow | null> {
  const db = sql();
  if (!db) return mem.quotes.find((q) => q.id === id) ?? null;
  const rows = (await db`select id, seq, created_at, to_char(valid_until, 'YYYY-MM-DD') as valid_until, input, totals, client_name, client_phone, shop_name, marketer, negotiated, status from quotes where id = ${id}`) as QuoteRow[];
  return rows[0] ? iso(rows[0]) : null;
}

export async function listQuotes(): Promise<QuoteRow[]> {
  const db = sql();
  if (!db) return [...mem.quotes].reverse();
  return ((await db`select id, seq, created_at, to_char(valid_until, 'YYYY-MM-DD') as valid_until, input, totals, client_name, client_phone, shop_name, marketer, negotiated, status from quotes order by seq desc`) as QuoteRow[]).map(iso);
}

export async function createLead(l: LeadInput): Promise<{ id: string }> {
  const db = sql();
  if (!db) {
    const id = crypto.randomUUID();
    mem.leads.push({ ...l, id, created_at: new Date().toISOString(), status: "new" });
    return { id };
  }
  const rows = await db`
    insert into leads (source, name, phone, shop, summary, intent, transcript, consent)
    values (${l.source}, ${l.name ?? null}, ${l.phone ?? null}, ${l.shop ?? null}, ${l.summary ?? null},
      ${l.intent ?? null}, ${l.transcript === undefined ? null : JSON.stringify(l.transcript)}::jsonb, ${l.consent})
    returning id`;
  return { id: rows[0].id as string };
}

export async function listLeads(): Promise<LeadRow[]> {
  const db = sql();
  if (!db) return [...mem.leads].reverse();
  return ((await db`select * from leads order by created_at desc`) as LeadRow[]).map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
}

export async function updateStatus(table: Table, id: string, status: string): Promise<void> {
  const db = sql();
  if (!db) {
    const row = (mem[table] as { id: string; status: string }[]).find((r) => r.id === id);
    if (row) row.status = status;
    return;
  }
  // Table names can't be parameterised, so branch to two fixed statements.
  if (table === "quotes") await db`update quotes set status = ${status} where id = ${id}`;
  else await db`update leads set status = ${status} where id = ${id}`;
}

async function getOverrides(): Promise<Floors> {
  const db = sql();
  return (db
    ? ((await db`select value from settings where key = 'floors'`)[0]?.value as Floors | undefined)
    : (mem.settings.get("floors") as Floors | undefined)) ?? {};
}

export async function getFloors(): Promise<Floors> {
  const floors: Floors = {};
  for (const p of packs) if (p.defaultFloor !== undefined) floors[p.id] = p.defaultFloor;
  return { ...floors, ...(await getOverrides()) };
}

/** Stores only the override for this pack (defaults stay in the catalogue). */
export async function setFloor(packId: Pack["id"], n: number): Promise<void> {
  const db = sql();
  if (!db) { mem.settings.set("floors", { ...(await getOverrides()), [packId]: n }); return; }
  await db`insert into settings (key, value) values ('floors', jsonb_build_object(${packId}::text, ${n}::int))
    on conflict (key) do update set value = coalesce(settings.value, '{}'::jsonb) || jsonb_build_object(${packId}::text, ${n}::int)`;
}
