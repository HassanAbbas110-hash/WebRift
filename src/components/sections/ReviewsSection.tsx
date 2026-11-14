import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { projects } from "@/data/projects";
import { googleRating, reviews } from "@/data/reviews";
import { SectionHeading, section } from "./SectionHeading";

export function ReviewsSection() {
  if (reviews.length === 0) return <ClientFeedback />;
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

// Shown until real reviews are added to src/data/reviews.ts. WebRift's own voice: no quotes, no names put in clients' mouths.
function ClientFeedback() {
  const clients = projects.filter((p) => p.kind === "Client project");
  return (
    <section className={section} aria-labelledby="feedback-heading">
      <SectionHeading
        eyebrow="What clients tell us"
        title={<span id="feedback-heading">{clients.length} client sites delivered. <span className="text-grad">Here is what we hear back.</span></span>}
        sub="We are collecting written reviews from these clients and will publish them here in their own words."
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["The look", "Clients tell us they love how their site looks and that it feels like their own business, not a template."],
          ["The service", "They tell us we were easy to work with: clear steps, quick replies on WhatsApp and changes made without fuss."],
          ["The result", "They tell us new customers and enquiries started reaching them through the site."],
        ].map(([title, copy], i) => (
          <li key={title}>
            <Reveal delay={i * 0.06} className="h-full">
              <div className="card h-full p-7">
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{copy}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Built for {clients.map((c) => c.name).join(", ")}.{" "}
        <Link href="/work" className="font-semibold text-cyan hover:underline">See the work →</Link>
      </p>
    </section>
  );
}
