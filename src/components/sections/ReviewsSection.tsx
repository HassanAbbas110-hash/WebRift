import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { projects } from "@/data/projects";
import { googleRating, reviews } from "@/data/reviews";
import { SectionHeading, section } from "./SectionHeading";

export function ReviewsSection() {
  if (reviews.length === 0) return null;
  return (
    <section className={section} aria-labelledby="reviews-heading">
      <SectionHeading
        eyebrow="In their words"
        title={<span id="reviews-heading">What clients say <span className="text-grad">after launch.</span></span>}
        sub="Unedited words from business owners we have built for."
      />
      {googleRating && (
        <a href={googleRating.url} target="_blank" rel="noopener noreferrer" className="glass mt-8 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm">
          <span className="font-display text-xl font-bold">{googleRating.value.toFixed(1)}</span>
          <span aria-hidden className="text-cyan">★★★★★</span>
          <span className="text-muted">from {googleRating.count} Google reviews ↗</span>
        </a>
      )}
      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => {
          const project = projects.find((p) => p.id === r.projectId);
          return (
            <li key={r.name + i}>
              <Reveal delay={i * 0.06} className="h-full">
                <figure className="card flex h-full flex-col p-7">
                  <span aria-hidden className="font-display text-grad text-5xl leading-none">“</span>
                  <blockquote className="mt-2 flex-1 text-lg leading-relaxed text-pretty">{r.quote}</blockquote>
                  <figcaption className="mt-6 border-t border-white/10 pt-4 text-sm">
                    <span className="font-semibold">{r.name}</span>
                    <span className="block text-muted">{r.role}</span>
                    <span className="mt-2 block text-xs text-muted">{r.source}</span>
                    {project && (
                      <Link href="/work" className="mt-3 inline-block text-xs font-semibold text-cyan">
                        See the {project.name} project →
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
