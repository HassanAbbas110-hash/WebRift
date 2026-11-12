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

export function waLink(text = "Hi WebRift, I'd like to chat about a website for my shop.") {
  return `https://wa.me/27609658641?text=${encodeURIComponent(text)}`;
}
