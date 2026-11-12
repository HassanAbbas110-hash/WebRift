import type { Metadata } from "next";
import Link from "next/link";
import { cities } from "@/data/catalogue";
import { CONTACT_EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to WebRift on WhatsApp (${WHATSAPP_DISPLAY}) or by phone (${PHONE_DISPLAY}). We serve shops in ${cities.join(", ")} and across South Africa.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const ways = [
    { label: "WhatsApp", value: WHATSAPP_DISPLAY, href: waLink(), note: "The fastest way to reach us.", ext: true },
    { label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, note: "Call us during business hours." },
    { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, note: "For documents and longer questions." },
  ];
  return (
    <div className="relative isolate mx-auto max-w-7xl overflow-x-clip px-4 py-14 sm:px-6 sm:py-20">
      <div aria-hidden="true" className="absolute -top-20 left-0 -z-10 size-[28rem] rounded-full bg-cyan/15 blur-[120px]" />
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">Contact</p>
        <h1 className="font-display mt-3 text-5xl leading-[1.02] font-bold tracking-tight text-balance sm:text-7xl">
          Let&apos;s talk about <span className="text-grad">your shop.</span>
        </h1>
        <p className="mt-5 text-lg text-muted">Questions, a custom quote or a negotiated pack price: message us and a real person will answer.</p>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {ways.map((w) => (
          <a
            key={w.label}
            href={w.href}
            {...(w.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`card group block p-7 transition hover:border-cyan/40 ${w.ext ? "border-[#25d366]/40" : ""}`}
          >
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">{w.label}</p>
            <p className="font-display mt-2 text-xl font-semibold break-all group-hover:text-cyan">{w.value}</p>
            <p className="mt-2 text-sm text-muted">{w.note}</p>
          </a>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl font-bold tracking-tight">Cities we serve</h2>
          <p className="mt-2 text-muted">We work with shops in these cities, and anywhere else in South Africa over WhatsApp.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {cities.map((c) => <li key={c} className="rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm">{c}</li>)}
          </ul>
        </section>
        <section className="card p-7">
          <h2 className="font-display text-2xl font-bold">Rather do it yourself?</h2>
          <p className="mt-2 text-muted">Build a quote in a minute, or get a free check-up of how your shop compares locally.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/quote" className="bg-grad rounded-full px-6 py-3 text-center font-semibold text-white">Build my quote →</Link>
            <Link href="/health-check" className="rounded-full border border-line px-6 py-3 text-center font-semibold hover:border-cyan/50">Free health check</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
