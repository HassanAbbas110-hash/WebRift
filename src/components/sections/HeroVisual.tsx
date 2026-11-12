// Task 8 replaces this with the shader hero; this static gradient is also its reduced-motion / low-end fallback.
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-48 left-1/2 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-blue/25 blur-[120px]" />
      <div className="absolute top-32 -left-48 h-[28rem] w-[28rem] rounded-full bg-cyan/20 blur-[110px]" />
      <div className="absolute top-10 -right-48 h-[32rem] w-[32rem] rounded-full bg-violet/30 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_30%,black_20%,transparent_70%)]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
