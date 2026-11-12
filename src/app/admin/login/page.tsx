import type { Metadata } from "next";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function Page() {
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-2xl font-semibold">Admin</h1>
      <AdminLoginForm />
    </div>
  );
}
