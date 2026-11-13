"use client"; // Error boundaries must be Client Components

export default function AdminError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Admin couldn&apos;t load</h1>
      <p className="mt-3 text-muted">The database may be unavailable. Check DATABASE_URL and the database status, then try again.</p>
      <button type="button" onClick={() => retry()} className="mt-6 rounded-full border border-line bg-white/5 px-5 py-2.5 text-sm font-semibold hover:border-cyan">Try again</button>
    </div>
  );
}
