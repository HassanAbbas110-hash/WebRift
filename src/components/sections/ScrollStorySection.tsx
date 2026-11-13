import { ScrollStoryLazy } from "@/components/fx/lazy";
import { SectionHeading, section } from "./SectionHeading";

export function ScrollStorySection() {
  return (
    <section className={section}>
      <SectionHeading
        eyebrow="Before → after"
        title={<>From messy chats to <span className="text-grad">tidy orders.</span></>}
        sub="Your customers keep using WhatsApp. You stop playing 20 questions."
      />
      <ScrollStoryLazy />
    </section>
  );
}
