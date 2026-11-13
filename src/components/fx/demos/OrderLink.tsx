import { waLink } from "@/lib/site";

/** Demo "Order on WhatsApp": opens WebRift's own line with the text marked "(demo)". */
export function OrderLink({ text, label = "Order on WhatsApp" }: { text: string; label?: string }) {
  return (
    <a
      href={waLink(`${text} (demo)`)}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl bg-[#25d366] px-4 py-2.5 text-center text-sm font-semibold text-[#062b14] transition hover:brightness-110"
    >
      {label} <span className="font-normal opacity-70">(demo)</span>
    </a>
  );
}

export const chip = (on: boolean) =>
  `rounded-xl border px-3 py-2 text-left text-sm transition ${on ? "border-cyan bg-cyan/15 text-text" : "border-line bg-white/[0.04] text-muted hover:border-cyan/50"}`;
export const appear = "motion-safe:animate-[fx-fade-up_0.4s_ease-out_both]";
