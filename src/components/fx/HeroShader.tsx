"use client";

import { useEffect, useRef, useState } from "react";

// Flowing fbm noise in the brand colours (cyan #22d3ee, blue #3b82f6, violet #7c3aed) on the page background #070b1a.
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
vec2 uv=gl_FragCoord.xy/r;
vec2 p=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
vec2 mp=(m-.5)*vec2(r.x/min(r.x,r.y),r.y/min(r.x,r.y));
float q=fbm(p*1.4+mp*.35+vec2(t*.04,t*.025));
float w=fbm(p*2.+q*1.9-vec2(t*.03,-t*.02));
vec3 bg=vec3(.027,.043,.102);
vec3 c=mix(vec3(.231,.51,.965),vec3(.486,.227,.929),smoothstep(.35,.75,w));
c=mix(c,vec3(.133,.827,.933),smoothstep(.5,.85,q)*.85);
float near=1.-smoothstep(0.,1.1,length(p-mp));
float a=smoothstep(.22,.72,w)*(.5+.5*near);
vec3 col=mix(bg,c,a*.9);
col=mix(bg,col,smoothstep(0.,.45,uv.y));
gl_FragColor=vec4(col,1.);}`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}";

/** Raw WebGL hero background. Pauses off-screen and in hidden tabs; renders nothing if WebGL fails. */
export default function HeroShader() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "on" | "failed">("loading");

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    const prog = gl && build(gl);
    if (!gl || !prog) return setState("failed");

    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");
    // A soft gradient needs little detail: DPR capped at 1.5, then rendered at 60% and upscaled by CSS.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const target = { x: 0.5, y: 0.6 };
    const cur = { ...target };
    const onPointer = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      target.x = (e.clientX - b.left) / b.width;
      target.y = 1 - (e.clientY - b.top) / b.height;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      target.x = 0.5 + Math.max(-1, Math.min(1, e.gamma / 30)) * 0.4;
      target.y = 0.6 - Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * 0.3;
    };

    let raf = 0, visible = true, first = true;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = 0;
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uM, cur.x, cur.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) { first = false; setState("on"); }
      loop();
    };
    const loop = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; loop(); });
    io.observe(canvas);
    const onVis = () => loop();
    const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); setState("failed"); };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    canvas.addEventListener("webglcontextlost", onLost);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  if (state === "failed") return null; // the static CSS gradient underneath stays visible
  return (
    <canvas
      ref={ref}
      className={`absolute inset-0 size-full transition-opacity duration-1000 ${state === "on" ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function build(gl: WebGLRenderingContext) {
  const prog = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
    const s = gl.createShader(type);
    if (!s || !prog) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    gl.attachShader(prog, s);
  }
  gl.bindAttribLocation(prog!, 0, "p");
  gl.linkProgram(prog!);
  if (!gl.getProgramParameter(prog!, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one oversized triangle covers the screen
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  return prog;
}
