"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { LogoMark } from "@/components/brand/LogoMark";
import { useMotionMode } from "./motion-store";
const sceneProjects = [projects[0], projects[1], projects[3], projects[5]];

export function ProjectCollision() {
  const root = useRef<HTMLDivElement>(null);
  const { mode } = useMotionMode();
  useEffect(() => {
    if (mode !== "full") return;
    let cancelled = false;
    let dispose = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{gsap},{ScrollTrigger}]) => {
      const el = root.current;
      if (cancelled || !el) return;
      gsap.registerPlugin(ScrollTrigger);
      el.dataset.enhanced = "true";
      const ctx = gsap.context(() => {}, el);
      dispose = () => { ctx.revert(); delete el.dataset.enhanced; };
      ctx.add(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-orbit-card]",el);
        const distance = () => Math.min(el.clientWidth * 0.35, 370);
        const timeline = gsap.timeline({scrollTrigger:{trigger:el,start:"top top+=80",end:"+=135%",pin:true,scrub:0.7,invalidateOnRefresh:true},defaults:{ease:"power2.inOut"}});
        gsap.set(cards,{xPercent:-50,yPercent:-50});
        gsap.set(cards,{x:(i) => (i%2 ? 1 : -1)*distance()*1.15,y:(i) => i<2 ? -110 : 130,rotation:(i) => [-24,20,14,-18][i],scale:0.9});
        timeline.to(cards,{x:(i)=>[-42,42,-24,24][i],y:(i)=>[-18,-8,18,30][i],rotation:(i)=>[-7,6,3,-3][i],scale:0.76,stagger:0.035,duration:1.1})
          .fromTo("[data-impact-ring]",{scale:0.2,opacity:0},{scale:2.3,opacity:0.65,duration:0.22},0.8)
          .to("[data-impact-ring]",{scale:3.1,opacity:0,duration:0.3},1.02)
          .fromTo("[data-collision-mark]",{scale:0.6,opacity:0},{scale:1,opacity:1,duration:0.35},0.85)
          .to(cards,{x:(i)=>(i%2 ? 1:-1)*distance(),y:(i)=>i<2 ? -105 : 125,rotation:(i)=>[-9,8,6,-7][i],scale:0.88,duration:1},1.35)
          .fromTo("[data-scene-caption]",{opacity:0,y:12},{opacity:1,y:0,duration:0.4},1.65);
      });
      ScrollTrigger.refresh();
    }).catch(() => { dispose(); if (root.current) delete root.current.dataset.enhanced; });
    return () => { cancelled = true; dispose(); };
  },[mode]);
  return <section className="relative isolate overflow-clip border-y border-line bg-panel/25" aria-labelledby="collision-title">
    <div ref={root} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="relative z-10 mx-auto max-w-2xl text-center"><p className="text-xs font-semibold tracking-[0.22em] text-cyan uppercase">Where the pieces come together</p><h2 id="collision-title" className="font-display mt-4 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">A little different.<br /><span className="text-grad">Entirely your business.</span></h2><p className="mt-3 text-sm text-muted">Design, useful tools and a clear customer journey. Built to work together.</p></header>
      <div className="collision-stage mt-8">
        <div aria-hidden="true" className="collision-centre"><div data-impact-ring className="absolute inset-0 rounded-full border border-cyan/50" /><span data-collision-mark className="grid size-24 place-items-center rounded-full border border-cyan/30 bg-bg/90 shadow-[0_0_60px_rgba(34,211,238,0.25)]"><LogoMark size={54} /></span></div>
        {sceneProjects.map((p,i) => <figure data-orbit-card key={p.id} className="collision-card overflow-hidden rounded-2xl border border-white/15 bg-bg shadow-xl" style={{zIndex:i+1}}><div className="relative aspect-[16/10]">{mode === "full" ? <Image src={p.image!} alt={`${p.name} ${p.kind.toLowerCase()} design`} fill sizes="(max-width: 899px) 45vw, 380px" className="object-cover object-top" /> : null}</div><figcaption className="flex items-center justify-between gap-2 px-3 py-2 text-[10px]"><span>{p.name}</span><span className="text-muted">{p.kind}</span></figcaption></figure>)}
      </div>
      <p className="relative z-10 mt-6 text-center text-sm text-muted"><span data-scene-caption className="inline-block">Your identity. Our craft.</span>{" "}<Link href="/work" className="font-medium text-cyan underline underline-offset-4">Explore the projects →</Link></p>
    </div>
  </section>;
}
