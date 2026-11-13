import Image from "next/image";
import type { Project } from "@/data/projects";

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-3xl border border-line bg-panel/50 transition-colors hover:border-cyan/40">
      {p.image ? (
        <a href={p.image} target="_blank" rel="noopener noreferrer" aria-label={`Open saved design of ${p.name}`} className="relative block aspect-[16/10] overflow-hidden border-b border-line bg-bg focus-visible:outline-2 focus-visible:outline-cyan">
          <Image src={p.image} alt={`${p.name} website design, captured November 2026`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px" className="object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]" />
          <span className="absolute right-3 bottom-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs text-white">Enlarge design ↗</span>
        </a>
      ) : (
        <div className="relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden border-b border-line bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.18),transparent_70%)] px-8 text-center">
          <span aria-hidden="true" className="font-display text-6xl font-bold text-cyan/30">{p.name.split(" ").map((x) => x[0]).join("")}</span>
          <p className="mt-4 text-sm text-muted">Past client project</p>
          <p className="mt-1 text-xs text-muted">Original design capture not currently available</p>
        </div>
      )}
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium tracking-wide">
          <span className={`rounded-full border px-2.5 py-1 ${p.kind === "Client project" ? "border-cyan/25 bg-cyan/10 text-cyan" : "border-violet/30 bg-violet/10 text-violet-300"}`}>{p.kind}</span>
          <span className="text-muted">{p.sector}</span>
        </div>
        <h3 className="font-display mt-4 text-2xl font-semibold">{p.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="rounded-lg border border-line px-2 py-1 text-xs text-muted">{t}</li>)}</ul>
        {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm font-semibold text-cyan hover:underline">{p.kind === "Client project" ? "Visit client website" : "Explore demo"} ↗</a> : <p className="mt-6 text-xs text-muted">Archived project · external website unavailable</p>}
      </div>
    </article>
  );
}
