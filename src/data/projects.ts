export type ProjectKind = "Client project" | "Business demo" | "Platform demo";
export interface Project {
  id: string; name: string; sector: string; kind: ProjectKind; description: string;
  tags: string[]; image?: string; url?: string; archived?: boolean;
}
export const projects: Project[] = [
  { id: "msh-attorneys", name: "MS Haroon Attorneys", sector: "Legal services", kind: "Client project", description: "A considered navy-and-white website that introduces the practice, explains its services and puts consultation enquiries within easy reach.", tags: ["Practice areas", "Consultation enquiries", "WhatsApp"], image: "/work/msh-attorneys.jpg", url: "https://mshattorneys.co.za/" },
  { id: "serenity", name: "Serenity Sanctuary", sector: "Beauty & wellness", kind: "Client project", description: "An elegant salon website bringing beauty services, a gallery and appointment enquiries together. Design preserved from the project preview after its original domain expired.", tags: ["Salon website", "Service gallery", "Appointment enquiries"], image: "/work/serenity.jpg", archived: true },
  { id: "seolwane", name: "Seolwane", sector: "Local business", kind: "Client project", description: "A bold local-business website that brings car washing, food and hospitality into one clear experience. Design preserved from the project preview after its original domain expired.", tags: ["Service showcase", "Hospitality", "WhatsApp enquiries"], image: "/work/seolwane.jpg", archived: true },
  { id: "hayats", name: "Hayats Auto Body", sector: "Automotive", kind: "Business demo", description: "A bold automotive concept built around repair services, visual storytelling and an estimate enquiry journey.", tags: ["Service showcase", "Repair gallery", "Estimate journey"], image: "/work/hayats.jpg", url: "https://hayats-precision-craft.lovable.app/" },
  { id: "barakah", name: "Al Barakah", sector: "Food & hospitality", kind: "Business demo", description: "A warm restaurant concept with appetising imagery, menu discovery and clear routes to ordering and contact.", tags: ["Menu design", "Food imagery", "Ordering journey"], image: "/work/barakah.jpg", url: "https://barakah-bites-site.lovable.app/" },
  { id: "7waves", name: "7Waves", sector: "Delivery platform", kind: "Platform demo", description: "An in-development delivery platform connecting customer, shop, rider and admin journeys, with a distinctive visual identity and purpose-built ordering workflows.", tags: ["Multi-role platform", "Checkout", "Delivery workflows"], image: "/work/7waves.jpg", url: "https://waves-pink-kappa.vercel.app/" },

];
