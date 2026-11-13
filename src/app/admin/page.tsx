import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { packs } from "@/data/catalogue";
import { getRole } from "@/lib/auth";
import { getFloors, listLeads, listQuotes } from "@/lib/db";
import { formatZAR } from "@/lib/quote";
import { waLink } from "@/lib/site";
import { saveFloors, setStatus } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const TABS = ["quotes", "leads", "floors"] as const;
const STATUSES = ["new", "contacted", "won", "lost"];
const FLOOR_PACKS = ["vape-pro", "vape-complete", "vape-starter"] as const;
const date = (iso: string) => iso.slice(0, 10);

function StatusForm({ table, id, status }: { table: "quotes" | "leads"; id: string; status: string }) {
  return (
    <form action={setStatus} className="flex gap-1">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} aria-label="Status" className="rounded border border-line bg-bg px-2 py-1">
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <button className="rounded border border-line px-2 py-1 text-muted hover:text-cyan">Save</button>
    </form>
  );
}

const Wa = ({ phone, text }: { phone: string | null | undefined; text: string }) =>
  phone ? <a href={waLink(text, phone)} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">Message on WhatsApp</a> : <span className="text-muted">No phone</span>;

async function Quotes() {
  const rows = await listQuotes();
  return (
    <Table head={["ID", "Date", "Client / shop", "Setup", "Monthly", "Year 1", "Marketer", "Status", ""]}>
      {rows.map((q) => (
        <tr key={q.id} className="border-t border-line align-top">
          <td className="p-2"><Link href={`/q/${q.id}`} className="text-cyan hover:underline">{q.id}</Link></td>
          <td className="p-2">{date(q.created_at)}</td>
          <td className="p-2">
            {[q.client_name, q.shop_name].filter(Boolean).join(" / ") || "-"}
            {q.negotiated && <span className="ml-2 rounded-full bg-violet/30 px-2 py-0.5 text-xs">negotiated</span>}
          </td>
          <td className="p-2">{formatZAR(q.totals.setup)}</td>
          <td className="p-2">{formatZAR(q.totals.monthly)}</td>
          <td className="p-2">{formatZAR(q.totals.year1)}</td>
          <td className="p-2">{q.marketer ?? "-"}</td>
          <td className="p-2"><StatusForm table="quotes" id={q.id} status={q.status} /></td>
          <td className="p-2"><Wa phone={q.client_phone} text={`Hi ${q.client_name ?? ""}, it's WebRift about your quote ${q.id}.`} /></td>
        </tr>
      ))}
    </Table>
  );
}

async function Leads() {
  const rows = await listLeads();
  return (
    <Table head={["Date", "Source", "Name / shop", "Phone", "Summary", "Status", ""]}>
      {rows.map((l) => (
        <tr key={l.id} className="border-t border-line align-top">
          <td className="p-2">{date(l.created_at)}</td>
          <td className="p-2">{l.source}</td>
          <td className="p-2">{[l.name, l.shop].filter(Boolean).join(" / ") || "-"}</td>
          <td className="p-2">{l.phone ?? "-"}</td>
          <td className="max-w-sm p-2">
            {l.summary}
            {l.source === "chat" && l.transcript != null && (
              <details className="mt-1 text-muted">
                <summary className="cursor-pointer">Transcript as sent by the visitor&apos;s browser (unverified)</summary>
                <pre className="mt-1 whitespace-pre-wrap text-xs">{typeof l.transcript === "string" ? l.transcript : JSON.stringify(l.transcript, null, 2)}</pre>
              </details>
            )}
          </td>
          <td className="p-2"><StatusForm table="leads" id={l.id} status={l.status} /></td>
          <td className="p-2"><Wa phone={l.phone} text={`Hi ${l.name ?? ""}, it's WebRift following up.`} /></td>
        </tr>
      ))}
    </Table>
  );
}

async function Floors() {
  const floors = await getFloors();
  return (
    <form action={saveFloors} className="glass max-w-md space-y-4 rounded-2xl border border-line p-6">
      {FLOOR_PACKS.map((id) => {
        const p = packs.find((x) => x.id === id)!;
        return (
          <label key={id} className="block text-sm text-muted">
            {p.name} floor (R, max {p.setup})
            <input name={id} type="number" min={0} max={p.setup} step={1} defaultValue={floors[id]} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-text" />
          </label>
        );
      })}
      <button className="bg-grad rounded-lg px-4 py-2 font-semibold text-bg">Save floors</button>
    </form>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-muted"><tr>{head.map((h, i) => <th key={i} className="p-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

async function Content({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if ((await getRole()) !== "admin") redirect("/admin/login");
  const { tab: t } = await searchParams;
  const tab = TABS.find((x) => x === t) ?? "quotes";
  return (
    <>
      <nav className="mt-6 flex gap-2">
        {TABS.map((x) => (
          <Link key={x} href={`/admin?tab=${x}`} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${x === tab ? "border-cyan text-cyan" : "border-line text-muted"}`}>{x}</Link>
        ))}
      </nav>
      <div className="mt-6">{tab === "quotes" ? <Quotes /> : tab === "leads" ? <Leads /> : <Floors />}</div>
    </>
  );
}

export default function Page(props: { searchParams: Promise<{ tab?: string }> }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold">Admin</h1>
      <Suspense fallback={<p className="mt-6 text-muted">Loading...</p>}>
        <Content searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
