"use client";

import { useRef } from "react";

/**
 * Hero "system core" — concentric rings of katakana + ticks counter-rotating
 * around a pulsing core, with a radar sweep and orbiting nodes. Tilts toward
 * the cursor for a 3D HUD feel. Pure SVG + CSS transforms (GPU-cheap), all
 * phosphor to match the palette. Decorative (aria-hidden); fine-pointer tilt
 * only; spins freeze under reduced motion (handled globally).
 */
const OUTER =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂ0011<>/=+* ﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0110 ｱｷｿﾀﾁ <>+= ｶｹｺｻ";
const INNER = "01ｱｷ＞＜10ｿﾀ＝＋01ｹｺ＞＜10ﾅﾆ＝＋";

export default function TerminalSigil() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 16}deg) rotateY(${px * 16}deg)`;
  };
  const reset = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      aria-hidden="true"
      className="sigil relative aspect-square w-[clamp(260px,30vw,500px)] transition-transform duration-300 ease-out will-change-transform"
    >
      <svg viewBox="0 0 220 220" className="h-full w-full overflow-visible">
        <defs>
          <path
            id="sigil-ring"
            d="M110,110 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0"
          />
          <path
            id="sigil-ring-inner"
            d="M110,110 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
          />
          <radialGradient id="sigil-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7CFFA0" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#39FF6A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#39FF6A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sigil-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7CFFA0" stopOpacity="0" />
            <stop offset="100%" stopColor="#7CFFA0" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Outer dotted tick ring */}
        <circle
          className="sig-a"
          cx="110"
          cy="110"
          r="104"
          fill="none"
          stroke="#39FF6A"
          strokeOpacity="0.3"
          strokeWidth="4"
          strokeDasharray="1 9"
        />

        {/* Thin counter-rotating ring */}
        <circle
          className="sig-b"
          cx="110"
          cy="110"
          r="96"
          fill="none"
          stroke="#39FF6A"
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeDasharray="26 12 4 12"
        />

        {/* Radar sweep arc */}
        <circle
          className="sig-sweep"
          cx="110"
          cy="110"
          r="90"
          fill="none"
          stroke="url(#sigil-sweep)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="80 486"
        />

        {/* Outer rotating glyph ring */}
        <g className="sig-a">
          <text
            fill="#39FF6A"
            fillOpacity="0.72"
            fontFamily="var(--font-display), monospace"
            fontSize="11"
            letterSpacing="3.5"
          >
            <textPath href="#sigil-ring" startOffset="0">
              {OUTER}
            </textPath>
          </text>
        </g>

        {/* Mid dashed ring */}
        <circle
          className="sig-c"
          cx="110"
          cy="110"
          r="68"
          fill="none"
          stroke="#39FF6A"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="2 8"
        />

        {/* Inner rotating glyph ring (opposite) */}
        <g className="sig-b">
          <text
            fill="#7CFFA0"
            fillOpacity="0.6"
            fontFamily="var(--font-display), monospace"
            fontSize="8"
            letterSpacing="2.5"
          >
            <textPath href="#sigil-ring-inner" startOffset="0">
              {INNER}
            </textPath>
          </text>
        </g>

        {/* Orbiting nodes */}
        <g className="sig-a">
          <circle cx="110" cy="14" r="2.5" fill="#7CFFA0" />
          <circle cx="206" cy="110" r="2" fill="#39FF6A" fillOpacity="0.8" />
          <circle cx="110" cy="206" r="2.5" fill="#7CFFA0" fillOpacity="0.7" />
          <circle cx="14" cy="110" r="2" fill="#39FF6A" fillOpacity="0.8" />
        </g>

        {/* Crosshair */}
        <g stroke="#39FF6A" strokeOpacity="0.16" strokeWidth="1">
          <line x1="110" y1="20" x2="110" y2="44" />
          <line x1="110" y1="176" x2="110" y2="200" />
          <line x1="20" y1="110" x2="44" y2="110" />
          <line x1="176" y1="110" x2="200" y2="110" />
        </g>

        {/* Core */}
        <circle cx="110" cy="110" r="44" fill="url(#sigil-core)" className="sig-pulse" />
        <circle
          cx="110"
          cy="110"
          r="22"
          fill="none"
          stroke="#7CFFA0"
          strokeOpacity="0.6"
          strokeWidth="1"
          className="sig-c"
          strokeDasharray="3 4"
        />
        <circle cx="110" cy="110" r="3.5" fill="#7CFFA0" className="sig-pulse" />
      </svg>
    </div>
  );
}
