// "Rift", the WebRift guide: an original friendly robot in the brand colours. Pure SVG, animated with CSS in pitch.css.
export type Pose = "wave" | "point" | "present" | "cheer" | "rest";

// Arm lines use solid colours: a gradient on a zero-width line has no bounding box and renders nothing.
// Arm angles in degrees: 0 hangs straight down, negative swings the right arm up and out, positive the left.
const ARMS: Record<Pose, [left: number, right: number]> = {
  rest: [18, -18],
  wave: [18, -120],
  point: [18, -90],
  present: [40, -58],
  cheer: [125, -125],
};

export function Mascot({ pose = "rest", className = "" }: { pose?: Pose; className?: string }) {
  const [l, r] = ARMS[pose];
  return (
    <svg viewBox="0 0 200 250" className={`mascot ${className}`} data-pose={pose} role="img" aria-label="Rift, the WebRift guide">
      <defs>
        <linearGradient id="m-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" /><stop offset=".5" stopColor="#3b82f6" /><stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <radialGradient id="m-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#22d3ee" stopOpacity=".35" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="236" rx="52" ry="7" fill="#000" opacity=".35" />
      <circle cx="100" cy="120" r="96" fill="url(#m-glow)" className="m-glow" />
      <g className="m-body">
        {/* antenna, echoing the node pins in the logo */}
        <line x1="100" y1="34" x2="100" y2="14" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="11" r="7" fill="#22d3ee" className="m-pin" />
        {/* arms sit behind the torso */}
        <g transform={`translate(58 150) rotate(${l})`}><g className="m-arm-l">
          <line x1="0" y1="0" x2="0" y2="46" stroke="#3b82f6" strokeWidth="13" strokeLinecap="round" />
          <circle cx="0" cy="52" r="10" fill="#e8ecf8" />
        </g></g>
        <g transform={`translate(142 150) rotate(${r})`}><g className="m-arm-r">
          <line x1="0" y1="0" x2="0" y2="46" stroke="#7c3aed" strokeWidth="13" strokeLinecap="round" />
          <circle cx="0" cy="52" r="10" fill="#e8ecf8" />
        </g></g>
        {/* legs */}
        <rect x="78" y="196" width="16" height="34" rx="8" fill="#3b82f6" />
        <rect x="106" y="196" width="16" height="34" rx="8" fill="#7c3aed" />
        {/* torso with the W mark */}
        <rect x="60" y="128" width="80" height="76" rx="26" fill="url(#m-grad)" />
        <path d="M80 152 L90 178 L100 162 L110 178 L120 152" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />
        {/* head */}
        <rect x="38" y="34" width="124" height="96" rx="34" fill="#0d1330" stroke="url(#m-grad)" strokeWidth="5" />
        <rect x="52" y="50" width="96" height="62" rx="22" fill="#070b1a" />
        <g className="m-eyes">
          <rect x="72" y="66" width="14" height="22" rx="7" fill="#22d3ee" />
          <rect x="114" y="66" width="14" height="22" rx="7" fill="#22d3ee" />
        </g>
        <path d={pose === "cheer" ? "M84 96 Q100 112 116 96 Z" : "M86 98 Q100 108 114 98"} fill={pose === "cheer" ? "#e8ecf8" : "none"} stroke="#e8ecf8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="64" cy="98" r="5" fill="#7c3aed" opacity=".6" />
        <circle cx="136" cy="98" r="5" fill="#7c3aed" opacity=".6" />
      </g>
    </svg>
  );
}
