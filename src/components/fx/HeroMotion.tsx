"use client";
import { useEffect, useRef } from "react";
import { useMotionMode } from "./motion-store";
export function HeroMotion({children}:{children:React.ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  const { mode } = useMotionMode();
  useEffect(() => {
    if (mode !== "full") return;
    let cancelled = false, dispose = () => {};
    Promise.all([import("gsap"),import("gsap/ScrollTrigger")]).then(([{gsap},{ScrollTrigger}]) => {
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const el=root.current!;
        gsap.fromTo(el.querySelectorAll("h1, h1 + p"),{y:25,opacity:0},{y:0,opacity:1,duration:0.8,stagger:0.12,ease:"power3.out"});
        const preview=el.querySelector("[data-hero-preview]");
        if (preview) gsap.to(preview,{y:75,rotation:3,scale:0.96,ease:"none",scrollTrigger:{trigger:el,start:"top top",end:"bottom top",scrub:0.7}});
      },root.current);
      dispose=()=>ctx.revert();
    }).catch(()=>{});
    return ()=>{cancelled=true;dispose();};
  },[mode]);
  return <div ref={root}>{children}</div>;
}
