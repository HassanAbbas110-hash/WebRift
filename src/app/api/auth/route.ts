import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { AUTH_COOKIE, getRole, sign } from "@/lib/auth";

const Body = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("sales"), pin: z.string().max(100) }),
  z.object({ kind: z.literal("admin"), password: z.string().max(200) }),
]);

const h = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, secret?: string) => !!secret && timingSafeEqual(h(a), h(secret));

// shortcut: counter is in memory per instance (resets on deploy/cold start), move to the DB if it gets abused.
const tries = new Map<string, { n: number; reset: number }>();
const MAX = 5, WINDOW = 15 * 60_000;

const cookie = (value: string, maxAge: number) =>
  `${AUTH_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const t = tries.get(ip);
  if (t && t.reset < now) tries.delete(ip);
  if ((tries.get(ip)?.n ?? 0) >= MAX) return Response.json({ error: "Too many tries" }, { status: 429 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid" }, { status: 400 });
  const b = parsed.data;
  const ok = b.kind === "sales" ? same(b.pin, process.env.SALES_PIN) : same(b.password, process.env.ADMIN_PASSWORD);
  if (!ok) {
    const cur = tries.get(ip) ?? { n: 0, reset: now + WINDOW };
    tries.set(ip, { ...cur, n: cur.n + 1 });
    return Response.json({ error: "Wrong" }, { status: 401 });
  }
  const [role, days] = b.kind === "sales" ? (["sales", 30] as const) : (["admin", 7] as const);
  return Response.json({ role }, { headers: { "Set-Cookie": cookie(sign(role, days), days * 86400) } });
}

export async function GET() {
  return Response.json({ role: await getRole() });
}

export async function DELETE() {
  return Response.json({ role: null }, { headers: { "Set-Cookie": cookie("", 0) } });
}
