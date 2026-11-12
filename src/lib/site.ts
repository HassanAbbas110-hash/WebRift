export const CONTACT_EMAIL = "hassanabbasbukhari51121@gmail.com";
export const WHATSAPP_DISPLAY = "060 965 8641";
export const PHONE_DISPLAY = "081 717 9974";
export const PHONE_TEL = "+27817179974";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packs", label: "Packs" },
  { href: "/quote", label: "Quote" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** phone: a client's number (SA local 0xx becomes 27xx); omitted means WebRift's own line. */
export function waLink(text = "Hi WebRift, I'd like to chat about a website for my shop.", phone?: string) {
  const to = phone ? phone.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "27") : "27609658641";
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
}

/** Placeholder domain until the owner confirms it; override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webrift.co.za";
