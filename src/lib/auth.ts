import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type Role = "sales" | "admin";
export const AUTH_COOKIE = "wr_auth";

const mac = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("base64url");

export function sign(role: Role, ttlDays: number): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  const body = Buffer.from(JSON.stringify({ r: role, e: Date.now() + ttlDays * 864e5 })).toString("base64url");
  return `${body}.${mac(body, secret)}`;
}

export function verify(token?: string): Role | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  const a = Buffer.from(sig), b = Buffer.from(mac(body, secret));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { r, e } = JSON.parse(Buffer.from(body, "base64url").toString());
    return (r === "sales" || r === "admin") && typeof e === "number" && e > Date.now() ? r : null;
  } catch {
    return null;
  }
}

/** Admin also counts as sales: callers wanting "sales access" accept either role. */
export async function getRole(): Promise<Role | null> {
  return verify((await cookies()).get(AUTH_COOKIE)?.value);
}
