import Link from "next/link";
import { SalesModeToggle } from "@/components/quote/SalesModeToggle";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_EMAIL, NAV_LINKS, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-line bg-panel/40">
      <div aria-hidden="true" className="bg-grad absolute inset-x-0 -top-px mx-auto h-px max-w-3xl opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="text-lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Websites, online stores and digital tools that bring local South African shops more customers.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-text">Quick links</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm md:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-cyan">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-text">Get in touch</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan">
                WhatsApp: {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`tel:${PHONE_TEL}`} className="text-muted hover:text-cyan">
                Phone: {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-muted hover:text-cyan">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pt-6 pb-24 text-xs text-muted sm:flex-row sm:justify-between sm:pr-24 sm:pb-6 sm:pl-6">
          <p>© WebRift. Prices in ZAR, excluding VAT.</p>
          <span className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-cyan">
              Privacy policy
            </Link>
            <SalesModeToggle />
          </span>
        </div>
      </div>
    </footer>
  );
}
