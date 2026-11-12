import { serializeJsonLd } from "@/lib/content";

// Native <script> per the Next.js JSON-LD guide; serializeJsonLd escapes "<".
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
