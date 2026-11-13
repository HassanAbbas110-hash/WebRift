"use client";

// Client wrappers so the heavy FX chunks (WebGL, GSAP, demos) are split out and only load on the home page.
import dynamic from "next/dynamic";
import { useMotionMode } from "./motion-store";
import { shouldUseStaticHero } from "@/lib/fx";

const HeroShader = dynamic(() => import("./HeroShader"), { ssr: false });
export const ScrollStoryLazy = dynamic(() => import("./ScrollStory"));
export const PhoneDemosLazy = dynamic(() => import("./demos/PhoneFrame"));

/** Loads the shader chunk only when the device should get it; otherwise the static gradient stays. */
export function HeroShaderGate() {
  const { mode } = useMotionMode();
  const on = mode === "full" && !shouldUseStaticHero({ reducedMotion: false, cores: typeof navigator === "undefined" ? undefined : navigator.hardwareConcurrency, webgl: typeof window !== "undefined" && "WebGLRenderingContext" in window });
  return on ? <HeroShader /> : null;
}
