"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { NAV_LINKS } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="glass sticky top-0 z-50 border-b border-line">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="WebRift home" className="text-base" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="group relative rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:text-text aria-[current=page]:text-text"
              >
                {l.label}
                <span className="bg-grad absolute inset-x-3.5 -bottom-px h-px scale-x-0 transition-transform group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="bg-grad hidden rounded-full px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(59,130,246,0.7)] transition hover:brightness-110 sm:inline-block"
          >
            Build a quote
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg/95 px-4 pb-5 md:hidden">
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-muted hover:bg-white/5 hover:text-text aria-[current=page]:text-text"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="bg-grad block rounded-full px-5 py-3 text-center font-semibold text-white"
          >
            Build a quote
          </Link>
        </div>
      )}
    </header>
  );
}
