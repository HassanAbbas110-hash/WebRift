import { LogoMark } from "./LogoMark";

type Props = { className?: string; variant?: "full" | "mono" };

export function Logo({ className = "", variant = "full" }: Props) {
  const mono = variant === "mono";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={40} mono={mono} className={mono ? "" : "drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"} />
      <span className="font-display text-[1.35em] font-semibold tracking-tight leading-none">
        Web<span className={mono ? "" : "text-grad"}>Rift</span>
      </span>
    </span>
  );
}
