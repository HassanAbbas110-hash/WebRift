"use client";

// Client wrappers so the heavy FX chunks (WebGL, GSAP, demos) are split out and only load on the home page.
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { shouldUseStaticHero } from "@/lib/fx";

const HeroShader = dynamic(() => import("./HeroShader"), { ssr: false });
export const ScrollStoryLazy = dynamic(() => import("./ScrollStory"));
export const PhoneDemosLazy = dynamic(() => import("./demos/PhoneFrame"));

const noSubscribe = () => () => {};
const shaderAllowed = () =>
  !shouldUseStaticHero({
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    cores: navigator.hardwareConcurrency,
    webgl: "WebGLRenderingContext" in window,
  });

/** Loads the shader chunk only when the device should get it; otherwise the static gradient stays. */
export function HeroShaderGate() {
  const on = useSyncExternalStore(noSubscribe, shaderAllowed, () => false);
  return on ? <HeroShader /> : null;
}
