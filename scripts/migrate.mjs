import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const sql = neon(process.env.DATABASE_URL);
const stmts = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .split(";").map((s) => s.trim()).filter(Boolean);
for (const s of stmts) await sql.query(s);
console.log(`Applied ${stmts.length} statements.`);
