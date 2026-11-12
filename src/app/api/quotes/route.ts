import { z } from "zod";
import { getRole } from "@/lib/auth";
import { createQuote, getFloors } from "@/lib/db";
import { phoneSchema as phone } from "@/lib/validation";
import { computeQuote, type QuoteInput } from "@/lib/quote";

const ids = z.array(z.string().max(40)).max(40);
const int = (max: number) => z.number().int().min(0).max(max);
const Body = z.object({
  input: z.object({
    packId: z.enum(["vape-starter", "vape-pro", "vape-complete", "retail-starter", "retail-online", "repeat-combo"]).optional(),
    productIds: ids.default([]),
    extraIds: ids.default([]),
    payment: z.enum(["standard", "instalments", "prepay"]),
    setupDiscount: int(100000).optional(),
    customLines: z.array(z.object({ label: z.string().trim().min(1).max(80), setup: int(1e6), monthly: int(1e6) })).max(10).optional(),
  }),
  client: z.object({
    name: z.string().trim().min(1).max(80),
    phone,
    shop: z.string().trim().max(80).optional(),
    consent: z.boolean(),
  }).refine((c) => c.consent === true).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid quote" }, { status: 400 });
  const { client } = parsed.data;
  const input: QuoteInput = parsed.data.input;

  const role = await getRole(); // admin counts as sales
  if (!role) { delete input.setupDiscount; delete input.customLines; }
  if (!input.packId && !input.productIds.length && !input.extraIds.length && !input.customLines?.length) {
    return Response.json({ error: "Empty quote" }, { status: 400 });
  }

  const totals = computeQuote(input, await getFloors());
  if (totals.lines.length === 0) return Response.json({ error: "Empty quote" }, { status: 400 });
  const negotiated = !!role && (totals.discountApplied > 0 || !!input.customLines?.length);
  const { id, validUntil } = await createQuote(input, totals, {
    client: client && { name: client.name, phone: client.phone, shop: client.shop },
    marketer: negotiated ? role! : undefined, // shortcut: no per-person identity yet, so the role stands in for the marketer name
    negotiated,
  });
  return Response.json({ id, url: `/q/${id}`, validUntil });
}
