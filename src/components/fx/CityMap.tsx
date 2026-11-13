// Stylised South Africa: a rough hand-traced outline (lon, lat) and approximate city positions. Decoration only.
const OUTLINE: [number, number][] = [
  [16.45, -28.6], [17.4, -28.75], [18.2, -28.9], [19.0, -28.95], [20.0, -28.4], [20.0, -24.8], [20.6, -26.6], [21.8, -26.8],
  [22.9, -25.6], [24.4, -25.6], [25.6, -25.6], [26.9, -24.6], [27.9, -23.8], [29.4, -22.2], [31.3, -22.4], [31.9, -24.5],
  [32.0, -25.9], [32.9, -26.85], [32.6, -27.9], [32.3, -28.8], [31.0, -29.9], [30.2, -31.1], [29.0, -32.3], [27.9, -33.05],
  [26.5, -33.75], [25.6, -34.0], [24.8, -34.2], [23.0, -34.05], [22.0, -34.2], [20.0, -34.83], [19.3, -34.6], [18.45, -34.35],
  [18.4, -33.9], [18.0, -33.0], [17.8, -32.5], [18.2, -31.6], [17.3, -30.5], [16.8, -29.4],
];
export const CITY_COORDS: Record<string, [number, number]> = {
  Rustenburg: [27.24, -25.67],
  Johannesburg: [28.05, -26.2],
  Pretoria: [28.19, -25.75],
  "Cape Town": [18.42, -33.92],
  Durban: [31.02, -29.86],
  Bloemfontein: [26.21, -29.12],
  "Port Elizabeth": [25.6, -33.96],
  "East London": [27.91, -33.02],
};

// Equirectangular, x squashed by ~cos(29°) so the shape is not stretched.
const xy = ([lon, lat]: [number, number]) => [Math.round((lon - 16) * 26 + 12), Math.round((-lat - 22) * 30 + 12)] as const;
const path = "M" + OUTLINE.map((p) => xy(p).join(" ")).join("L") + "Z";

/** aria-hidden: the city list next to it carries the content. Pulses are CSS, motion-safe only. */
export function CityMap({ cities }: { cities: string[] }) {
  return (
    <svg viewBox="0 0 460 410" aria-hidden="true" className="w-full max-w-xl">
      <defs>
        <linearGradient id="sa-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d={path} fill="rgb(59 130 246 / 0.07)" stroke="url(#sa-stroke)" strokeWidth="2.5" strokeLinejoin="round" />
      {cities.map((c, i) => {
        const at = CITY_COORDS[c];
        if (!at) return null;
        const [x, y] = xy(at);
        // Gauteng cities sit close together; nudge labels apart.
        const dy = c === "Pretoria" ? -10 : c === "Johannesburg" ? 16 : 4;
        const left = ["Rustenburg", "Cape Town", "Port Elizabeth"].includes(c);
        return (
          <g key={c}>
            <circle
              cx={x} cy={y} r="5" fill="#22d3ee"
              style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${i * 0.35}s` }}
              className="motion-safe:animate-[fx-pulse_2.8s_ease-out_infinite]"
            />
            <circle cx={x} cy={y} r="4" fill="#22d3ee" className="drop-shadow-[0_0_6px_#22d3ee]" />
            <text x={left ? x - 9 : x + 9} y={y + dy} textAnchor={left ? "end" : "start"} className="fill-text text-[11px] font-medium">
              {c}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
