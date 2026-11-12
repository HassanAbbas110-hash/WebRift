import { z } from "zod";

/** SA-style phone: optional leading +, digits and spaces only, 9..15 digits. */
export const phoneSchema = z.string().regex(/^\+?[\d ]+$/).refine((s) => {
  const n = s.replace(/\D/g, "").length;
  return n >= 9 && n <= 15;
});
