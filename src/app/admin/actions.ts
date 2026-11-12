"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { packs } from "@/data/catalogue";
import { assertAdmin } from "@/lib/admin";
import { setFloor, updateStatus } from "@/lib/db";

const Status = z.enum(["new", "contacted", "won", "lost"]);

export async function setStatus(formData: FormData) {
  await assertAdmin();
  const table = formData.get("table") === "leads" ? "leads" : "quotes";
  const status = Status.parse(formData.get("status"));
  await updateStatus(table, z.string().min(1).parse(formData.get("id")), status);
  revalidatePath("/admin");
}

const FLOOR_PACKS = ["vape-pro", "vape-complete", "vape-starter"] as const;

export async function saveFloors(formData: FormData) {
  await assertAdmin();
  const next: [(typeof FLOOR_PACKS)[number], number][] = [];
  for (const id of FLOOR_PACKS) {
    const raw = String(formData.get(id) ?? "").trim();
    if (raw === "") continue;
    const setup = packs.find((p) => p.id === id)!.setup;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0 || n > setup) throw new Error(`Floor for ${id} must be a whole number from 0 to ${setup}`);
    next.push([id, n]);
  }
  for (const [id, n] of next) await setFloor(id, n);
  revalidatePath("/admin");
}
