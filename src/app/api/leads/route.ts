import { z } from "zod";
import { createLead } from "@/lib/db";

const Body = z.object({
  source: z.enum(["health-check", "quote"]),
  name: z.string().trim().min(1).max(80),
  phone: z.string().regex(/^[\d\s+]+$/).refine((s) => {
    const n = s.replace(/\D/g, "").length;
    return n >= 9 && n <= 15;
  }),
  shop: z.string().trim().max(80).optional(),
  area: z.string().trim().max(80).optional(),
  summary: z.string().trim().max(1000).optional(),
  consent: z.literal(true),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid lead" }, { status: 400 });
  const { area, summary, ...rest } = parsed.data;
  const full = [summary, area && `Area: ${area}`].filter(Boolean).join("\n") || undefined;
  return Response.json(await createLead({ ...rest, summary: full }));
}
