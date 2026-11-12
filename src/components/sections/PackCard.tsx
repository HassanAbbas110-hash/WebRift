import Link from "next/link";
import { productById, type Pack } from "@/data/catalogue";
import { packFigures } from "@/lib/content";
import { formatZAR } from "@/lib/quote";

export function PackCard({ id, detailed }: { id: Pack["id"]; detailed?: boolean }) {
  const f = packFigures(id);
  const { pack } = f;
  return (
    <article
      className={`card relative flex h-full flex-col p-7 ${pack.popular ? "border-cyan/50 bg-cyan/[0.04] shadow-[0_30px_80px_-30px_rgba(34,211,238,0.5)]" : ""}`}
    >
      {pack.popular && (
        <span className="bg-grad absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold text-white">Most popular</span>
      )}
      <p className="text-xs font-semibold tracking-[0.18em] text-muted">{pack.audience}</p>
      <h3 className="font-display mt-2 text-2xl font-bold">{pack.name}</h3>
      <p className="text-sm text-cyan">{pack.tagline}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight">{formatZAR(f.setup)}</span>
        <span className="text-sm text-muted">setup</span>
      </p>
      <p className="text-sm text-muted">+ {formatZAR(f.monthly)}/mo · Year 1 {formatZAR(f.year1)}</p>
      <p className="mt-3 inline-flex w-fit rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
        You save {formatZAR(f.youSave)} vs typical market
      </p>
      <p className="mt-5 text-sm leading-relaxed text-muted">{pack.blurb}</p>

      {detailed && (
        <>
          <ul className="mt-5 space-y-1.5 text-sm">
            {pack.productIds.map((pid) => (
              <li key={pid} className="flex gap-2"><span className="text-cyan">✓</span>{productById(pid)?.name}</li>
            ))}
          </ul>
          {pack.bonuses.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              {pack.bonuses.map((b) => (
                <li key={b.label} className="flex justify-between gap-3">
                  <span><span className="text-violet">★</span> Free: {b.label}</span>
                  <span className="text-muted line-through">{formatZAR(b.worth)}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
            <div><dt className="text-muted">3 instalments of</dt><dd className="font-semibold">{formatZAR(f.instalment)}</dd></div>
            <div><dt className="text-muted">Prepay year 1 (2 months free)</dt><dd className="font-semibold">{formatZAR(f.prepay)}</dd></div>
          </dl>
        </>
      )}

      <div className="mt-auto pt-7">
        <Link
          href={`/quote?pack=${pack.id}`}
          className={`block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${pack.popular ? "bg-grad text-white hover:brightness-110" : "border border-line bg-white/5 hover:border-cyan/50"}`}
        >
          Quote this pack →
        </Link>
      </div>
    </article>
  );
}

export const NegotiableNote = () => (
  <p className="mt-8 text-center text-sm text-muted">
    Pricing negotiable on packs — <Link href="/contact" className="text-cyan underline-offset-4 hover:underline">chat to us</Link>. All prices in ZAR, excluding VAT.
  </p>
);
