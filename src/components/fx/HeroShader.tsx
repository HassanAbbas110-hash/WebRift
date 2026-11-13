"use client";

import { useEffect, useRef, useState } from "react";

// Flowing fbm noise in the brand colours (cyan #22d3ee, blue #3b82f6, violet #7c3aed) on the page background #070b1a.
// highp where available: the sin-hash needs fp32, and fp16 mediump on many mobile GPUs would flatten the noise.
const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
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

/** Raw WebGL hero background. Pauses off-screen and in hidden tabs; leaves the CSS gradient showing if WebGL fails or is lost. */
export default function HeroShader() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false); // fades in after the first frame

  useEffect(() => {
    // A fresh canvas per effect run: Activity (cacheComponents) re-runs this effect on the same DOM after hiding it,
    // and getContext on the old canvas would return the context we deliberately lost in cleanup.
    const host = ref.current!;
    const canvas = document.createElement("canvas");
    canvas.className = "block size-full";
    host.append(canvas);
    // failIfMajorPerformanceCaveat: software WebGL gets the static gradient instead.
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", failIfMajorPerformanceCaveat: true });
    const res = gl ? build(gl) : null;
    if (!gl || !res || !res.ok) {
      if (gl && res) dispose(gl, res);
      canvas.remove(); // the empty host leaves the static gradient visible
      return;
    }
    const prog = res.prog!;

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
      if (first) { first = false; setOn(true); }
      loop();
    };
    const loop = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; loop(); });
    io.observe(canvas);
    const onVis = () => loop();
    const onLost = () => { cancelAnimationFrame(raf); canvas.remove(); }; // fall back to the gradient
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
      canvas.removeEventListener("webglcontextlost", onLost); // before loseContext, so our own loss is not treated as a failure
      dispose(gl, res);
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 transition-opacity duration-1000 ${on ? "opacity-100" : "opacity-0"}`}
    />
  );
}

type Res = { ok: boolean; prog: WebGLProgram | null; shaders: WebGLShader[]; buf: WebGLBuffer | null };

function build(gl: WebGLRenderingContext): Res {
  const res: Res = { ok: false, prog: gl.createProgram(), shaders: [], buf: null };
  if (!res.prog) return res;
  for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
    const s = gl.createShader(type);
    if (!s) return res;
    res.shaders.push(s);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return res;
    gl.attachShader(res.prog, s);
  }
  gl.bindAttribLocation(res.prog, 0, "p");
  gl.linkProgram(res.prog);
  if (!gl.getProgramParameter(res.prog, gl.LINK_STATUS)) return res;
  gl.useProgram(res.prog);
  res.buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, res.buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // one oversized triangle covers the screen
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  res.ok = true;
  return res;
}

/** Frees GPU objects and the context itself, so home -> elsewhere -> home loops don't pile up contexts. */
function dispose(gl: WebGLRenderingContext, res: Res) {
  gl.deleteProgram(res.prog);
  res.shaders.forEach((s) => gl.deleteShader(s));
  gl.deleteBuffer(res.buf);
  gl.getExtension("WEBGL_lose_context")?.loseContext();
}
