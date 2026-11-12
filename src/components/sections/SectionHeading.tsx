export function SectionHeading({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean }) {
  return (
    <header className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">{eyebrow}</p>
      <h2 className="font-display mt-3 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg text-pretty text-muted">{sub}</p>}
    </header>
  );
}

export const section = "mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28";
