import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/CtaSection";
import { DeliverySection } from "@/components/sections/DeliverySection";

export const metadata: Metadata = {
  title: "About",
  description: "WebRift builds WhatsApp-first websites, Google visibility, loyalty tools and monthly check-ups for local South African shops.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  ["WhatsApp-first", "Most South African customers already chat to shops on WhatsApp, so we build around that habit instead of pushing you onto costly till systems or SaaS platforms."],
  ["Lightweight and low-cost", "Everything runs on lean, proven tools, which keeps setup low and monthly fees fair."],
  ["Checked every month", "A Health Check and a Monthly Growth Report show how you compare with nearby competitors and what to do next."],
  ["Owner-focused", "Cash, stock and warranty control for owners who can't be in the shop all day."],
];

// Catalogue p.13.
const COMPLIANCE = [
  ["The law is changing", "The Tobacco Products and Electronic Delivery Systems Control Bill was not yet law at our last check (committee stage, June 2026). It would ban vape advertising, promotion and retail displays. Our tools are the shop's own pages and normal chats, not ads, and are easy to adjust."],
  ["WhatsApp rules", "Third-party guides say vapes cannot be sold through the WhatsApp Business API or the in-app catalogue. So the vape storefront is the shop's own web page with an ordinary chat link, and we don't build AI bots on the Business API for vape shops. Confirm against WhatsApp's own current policy before launch."],
  ["Ad and social platforms", "Meta, TikTok and Google restrict vape ads and promotion. So for vape shops, profile setup means information pages only, and we don't sell ad management. We rely on Google Maps, opt-in lists, loyalty and QR stands instead."],
  ["Age and consent", "The 18+ pop-up, checkout confirmation, consent wording and ID-check reminder are part of our 18+ Age Check & Compliance Setup. It is a self-declaration: the owner stays responsible for ID checks at collection or delivery."],
];

const TEAM = [["Founder", "F"], ["Marketing & Sales", "MS"]];

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">About WebRift</p>
          <h1 className="font-display mt-3 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
            Practical digital tools for <span className="text-grad">the shops on your high street.</span>
          </h1>
          <p className="mt-6 text-lg text-muted">
            We started out building websites. Shop owners kept asking for more: to be found on Google, to get customers coming back, to know their numbers and to keep the till honest. So WebRift grew into a toolkit for local shops, built around the way South Africans already shop: on their phones, over WhatsApp.
          </p>
        </header>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {PILLARS.map(([t, d]) => (
            <div key={t} className="card p-7">
              <h2 className="font-display text-xl font-semibold">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>

        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">Built for vape stores</p>
            <h2 className="font-display mt-3 text-4xl font-bold tracking-tight">60% of our clients are vape shops.</h2>
            <p className="mt-4 text-muted">
              Their customers are weekly regulars, the counter questions repeat all day, and faulty stock costs real money. So we built tools for exactly that: finders, loyalty, restock lists and stock control. We market our services to shops; we don&apos;t advertise vape products.
            </p>
          </div>
          <div className="card p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">Compliance and platform checklist</h3>
            <dl className="mt-5 space-y-5">
              {COMPLIANCE.map(([t, d]) => (
                <div key={t}>
                  <dt className="font-semibold">{t}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{d}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 rounded-xl border border-violet/30 bg-violet/10 px-4 py-3 text-sm">
              This is a practical checklist, not legal advice. Ask your attorney to confirm wording and local rules.
            </p>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-4xl font-bold tracking-tight">The team</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
            {TEAM.map(([role, initials]) => (
              <div key={role} className="card flex items-center gap-5 p-6">
                <span aria-hidden="true" className="bg-grad font-display grid size-16 shrink-0 place-items-center rounded-full text-xl font-bold text-white">{initials}</span>
                <div>
                  <p className="font-display text-lg font-semibold">{role}</p>
                  <p className="text-sm text-muted">WebRift</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <DeliverySection />
      <CtaSection />
    </>
  );
}
