import { useId } from "react";

type Props = { size?: number; mono?: boolean; className?: string };

// Redrawn from docs/source/logo-current.png: two overlapping W ribbons, four corner brackets, four node pins.
export function LogoMark({ size = 40, mono = false, className }: Props) {
  const id = useId();
  const frame = mono ? "currentColor" : `url(#${id}f)`;
  const left = mono ? "currentColor" : `url(#${id}l)`;
  const right = mono ? "currentColor" : `url(#${id}r)`;

  return (
    <svg
      width={size}
      height={(size * 100) / 120}
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {!mono && (
        <defs>
          <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="0.5" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={`${id}l`} x1="26" y1="30" x2="64" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id={`${id}r`} x1="94" y1="30" x2="56" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      )}

      {/* corner brackets (pathLength lets .logo-draw animate every stroke the same way) */}
      <g stroke={frame} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} d="M6 30V18Q6 8 16 8H30" />
        <path pathLength={1} d="M90 8H104Q114 8 114 18V30" />
        <path pathLength={1} d="M6 70V82Q6 92 16 92H30" />
        <path pathLength={1} d="M90 92H104Q114 92 114 82V70" />
      </g>

      {/* node pins, evenly spaced on the top and bottom edges */}
      <g fill={frame} stroke={frame} strokeWidth="2" strokeLinecap="round">
        <path pathLength={1} d="M40 5V15M80 5V15M40 85V95M80 85V95" />
        <circle cx="40" cy="4" r="3" />
        <circle cx="80" cy="4" r="3" />
        <circle cx="40" cy="96" r="3" />
        <circle cx="80" cy="96" r="3" />
      </g>

      {/* W: two rounded ribbons that cross in the middle */}
      <g strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} d="M27 30L45 70L62 44" stroke={left} opacity={mono ? 0.55 : 0.92} />
        <path pathLength={1} d="M58 44L75 70L93 30" stroke={right} opacity={mono ? 1 : 0.85} />
      </g>
    </svg>
  );
}
