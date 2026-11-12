import "server-only";
import type { Pack } from "@/data/catalogue";

/** Negotiable floors: server-only so they never reach a public bundle. Admin overrides live in the DB. */
export const DEFAULT_FLOORS: Partial<Record<Pack["id"], number>> = { "vape-starter": 3500 };
