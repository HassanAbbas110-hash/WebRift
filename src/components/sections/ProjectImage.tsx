"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
const illustrated = projects.filter((p) => p.image);
export function ProjectImage({project:p}:{project:Project}) {
  const [active,setActive]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const open=active!==null;
  const selected=active===null ? p : illustrated[active];
  useEffect(()=>{
    if (!open || !dialog.current) return;
    const el=dialog.current;
    const opener=trigger.current;
    const previous=document.documentElement.style.overflow;
    document.documentElement.style.overflow="hidden";
    el.showModal();
    return ()=>{el.close();document.documentElement.style.overflow=previous;opener?.focus({preventScroll:true});};
  },[open]);
  const next=(direction:number)=>setActive((i)=>i===null ? i : (i+direction+illustrated.length)%illustrated.length);
  return <>
    <button ref={trigger} type="button" onClick={()=>setActive(illustrated.findIndex((x)=>x.id===p.id))} aria-label={`Enlarge ${p.name} design`} className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden border-b border-line bg-bg focus-visible:outline-2 focus-visible:outline-cyan">
      <Image src={p.image!} alt={`${p.name} website design, captured November 2026`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px" className="object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]" />
      <span className="absolute right-3 bottom-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs text-white">Explore design ↗</span>
    </button>
    <dialog ref={dialog} className="image-viewer" aria-label="Project design viewer" onCancel={()=>setActive(null)} onClick={(e)=>{if(e.target===e.currentTarget)setActive(null);}} onKeyDown={(e)=>{if(e.key==="ArrowRight"){e.preventDefault();next(1);} if(e.key==="ArrowLeft"){e.preventDefault();next(-1);}}}>
      {open && <div className="p-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4"><div><h2 className="font-display text-lg font-semibold">{selected.name}</h2><p className="text-xs text-muted">{selected.kind} · {selected.sector}</p></div><button type="button" autoFocus onClick={()=>setActive(null)} aria-label="Close design viewer" className="rounded-full border border-line px-4 py-2 text-sm hover:border-cyan">Close ×</button></div>
        <div className="relative h-[60svh] overflow-hidden rounded-xl bg-panel"><Image key={selected.id} src={selected.image!} alt={`${selected.name} saved website design`} fill sizes="95vw" className="object-contain" /></div>
        <div className="mt-4 flex items-center justify-between gap-3"><button type="button" onClick={()=>next(-1)} className="rounded-full border border-line px-4 py-2 text-sm hover:border-cyan">← Previous</button><span aria-live="polite" className="text-xs text-muted">{(active??0)+1} / {illustrated.length}</span><button type="button" onClick={()=>next(1)} className="rounded-full border border-line px-4 py-2 text-sm hover:border-cyan">Next →</button></div>
        <p className="mt-3 text-center text-xs text-muted">Use arrow keys to browse. Escape closes the viewer.</p>
      </div>}
    </dialog>
  </>;
}
