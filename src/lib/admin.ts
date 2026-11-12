import { getRole } from "@/lib/auth";

/** Server-action guard: server actions are public POST endpoints, so re-check the role every call. */
export async function assertAdmin(): Promise<void> {
  if ((await getRole()) !== "admin") throw new Error("Unauthorized");
}
