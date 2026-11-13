import type { Metadata } from "next";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How WebRift collects, uses and protects your personal information under POPIA.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 [&_h2]:font-display [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted">
      <p className="!mt-0 text-xs font-semibold tracking-[0.2em] !text-cyan uppercase">POPIA notice</p>
      <h1 className="font-display mt-3 text-5xl font-bold tracking-tight">Privacy notice</h1>
      <p>Last updated: 13 November 2026</p>
      <p>
        WebRift respects your privacy and handles personal information in line with the Protection of Personal Information Act (POPIA). This notice explains what we collect on this website, why, and what you can ask us to do with it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>The details of quotes you build (the pack, products and payment option you choose).</li>
        <li>Your name, phone number and shop name, only when you choose to give them to us, for example on the Health Check form or when you save a quote.</li>
        <li>Chat transcripts, only if you agree to us keeping them.</li>
      </ul>
      <p>We only store a name or number after you tick the consent box (or say yes in chat). The box is never ticked for you.</p>

      <h2>Why we collect it</h2>
      <p>To follow up on your request: to send your quote or Health Check, answer your questions and, if you want, start working with you. We don&apos;t use it for anything else.</p>

      <h2>Where it is kept</h2>
      <p>In a hosted Postgres database (via Vercel). Access is limited to the WebRift team.</p>
      <p>Anyone with a saved quote&apos;s link can open that quote.</p>

      <h2>Chat assistant</h2>
      <p>
        Messages you type in the chat are sent to our AI provider (Anthropic, via Vercel&apos;s AI Gateway) to generate answers, which may be processed outside South Africa. Don&apos;t type personal details you don&apos;t want processed. The chat is only saved to our records if you tick the box and press Share.
      </p>

      <h2>How long we keep it</h2>
      <p>We delete your details when you ask, and we review what we hold at least once a year and remove what we no longer need.</p>

      <h2>We never sell your data</h2>
      <p>We do not sell, rent or trade your personal information to anyone.</p>

      <h2>Your rights</h2>
      <p>You can ask to see the information we hold about you, to correct it, or to delete it. Contact us on WhatsApp or by email:</p>
      <ul>
        <li>
          WhatsApp:{" "}
          <a href={waLink("Hi WebRift, I have a privacy request about my information.")} target="_blank" rel="noopener noreferrer" className="text-cyan underline">{WHATSAPP_DISPLAY}</a>
        </li>
        <li>
          Email: <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-cyan underline">{CONTACT_EMAIL}</a>
        </li>
      </ul>
      <p>If you are unhappy with how we handle your information, you may also complain to the Information Regulator of South Africa.</p>
    </article>
  );
}
