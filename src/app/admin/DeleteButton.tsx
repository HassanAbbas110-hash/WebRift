"use client";
import { deleteRow } from "./actions";

/** Permanent delete (POPIA erasure requests), behind a native confirm. */
export function DeleteButton({ table, id, label }: { table: "quotes" | "leads"; id: string; label: string }) {
  return (
    <form action={deleteRow} onSubmit={(e) => { if (!confirm(`Delete ${label} permanently? This can't be undone.`)) e.preventDefault(); }}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button className="rounded border border-line px-2 py-1 text-muted hover:border-red-400 hover:text-red-400">Delete</button>
    </form>
  );
}
