import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading, section } from "./SectionHeading";

export function PortfolioSection() {
  return <section className={section} id="work">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <SectionHeading eyebrow="Selected work" title={<>Different businesses.<br /><span className="text-grad">Their own identity.</span></>} sub="Client websites and business demos, designed around the people who use them. Real design captures, saved here so the work stays visible." />
      <Link href="/work" className="rounded-full border border-cyan/30 px-5 py-3 text-sm font-semibold text-cyan transition hover:bg-cyan/10">Explore all 6 projects ↗</Link>
    </div>
    <div className="mt-10 grid gap-6 lg:grid-cols-3">{projects.slice(0, 3).map((p) => <ProjectCard key={p.id} project={p} />)}</div>
    <p className="mt-5 text-xs leading-relaxed text-muted">Client projects and demos are labelled individually. Demos show design and functionality, not client endorsements or measured business results.</p>
  </section>;
}
