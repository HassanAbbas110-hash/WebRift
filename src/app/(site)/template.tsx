// Route transition: CSS fade/rise per navigation (templates remount per route). No JS, no exit animation, motion-safe only.
// Fill mode is "backwards", not "both": a retained transform would trap GSAP's position:fixed pin inside this div.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-[fx-fade-up_0.45s_cubic-bezier(0.22,1,0.36,1)_backwards]">{children}</div>;
}
