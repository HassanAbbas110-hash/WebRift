// Native <script> per the Next.js JSON-LD guide; "<" escaped so catalogue text can't break out of the tag.
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}
