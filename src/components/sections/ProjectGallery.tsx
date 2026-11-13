"use client";
import { useState } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
const filters = ["All work", "Client projects", "Demos"] as const;
export function ProjectGallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All work");
  const shown = projects.filter((p) => filter === "All work" || (filter === "Client projects" ? p.kind === "Client project" : p.kind !== "Client project"));
  return <>
    <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">{filters.map((f) => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`rounded-full border px-5 py-2.5 text-sm transition ${filter === f ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-line text-muted hover:text-text"}`}>{f}</button>)}</div>
    <p role="status" className="mt-5 text-sm text-muted">Showing {shown.length} {shown.length === 1 ? "project" : "projects"}</p>
    <div className="mt-6 grid gap-6 md:grid-cols-2">{shown.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
  </>;
}
