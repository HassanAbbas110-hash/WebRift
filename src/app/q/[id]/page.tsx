import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PrintQuote } from "@/components/quote/PrintQuote";
import { getQuote } from "@/lib/db";
import { quoteStatus } from "@/lib/quote";

export const metadata: Metadata = { title: "Your quote", robots: { index: false } };

const long = (ymd: string) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

async function SavedQuote({ params }: { params: PageProps<"/q/[id]">["params"] }) {
  const m = /^(WR-\d{4}-\d{4,})-([0-9a-f]{10})$/.exec((await params).id);
  const q = m ? await getQuote(m[1], m[2]) : null;
  if (!q) notFound();
  const createdJhb = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Johannesburg" }).format(new Date(q.created_at));
  // Anyone with the link can open it: only the shop name is shown, never the client's name or number.
  return (
    <PrintQuote
      id={q.id} token={q.token} negotiated={q.negotiated} marketer={q.marketer} date={long(createdJhb)} validUntil={long(q.valid_until)} shop={q.shop_name}
      totals={q.totals} expired={quoteStatus(q.valid_until, new Date()) === "expired"}
    />
  );
}

export default function QuotePage({ params }: PageProps<"/q/[id]">) {
  return (
    <Suspense fallback={<div className="mx-auto my-10 h-[70svh] max-w-3xl animate-pulse rounded-3xl bg-white/[0.03]" />}>
      <SavedQuote params={params} />
    </Suspense>
  );
}
