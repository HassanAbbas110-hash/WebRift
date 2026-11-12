import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PUBLIC_PATHS = ["/", "/services", "/packs", "/quote", "/health-check", "/about", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
