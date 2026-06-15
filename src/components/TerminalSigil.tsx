"use client";

import { useRef } from "react";

/**
 * Hero "system core" — concentric rings of katakana + ticks that counter-rotate
 * around a pulsing core, tilting toward the cursor for a 3D HUD feel. Pure SVG +
 * CSS transforms (GPU-cheap). Decorative (aria-hidden); fine-pointer tilt only,
 * and the spins freeze under reduced motion (handled globally).
 */
const GLYPHS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂ0011<>/=+* ﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0110 ｱｷｿﾀﾁ <>+= ｶｹｺｻ";

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
      className="sigil relative aspect-square w-[clamp(220px,26vw,420px)] transition-transform duration-300 ease-out will-change-transform"
    >
      <svg viewBox="0 0 220 220" className="h-full w-full overflow-visible">
        <defs>
          <path
            id="sigil-ring"
            d="M110,110 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"
          />
          <radialGradient id="sigil-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7CFFA0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#39FF6A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer dotted tick ring */}
        <circle
          className="sig-a"
          cx="110"
          cy="110"
          r="102"
          fill="none"
          stroke="#39FF6A"
          strokeOpacity="0.35"
          strokeWidth="4"
          strokeDasharray="1 9"
        />

        {/* Thin counter-rotating ring */}
        <circle
          className="sig-b"
          cx="110"
          cy="110"
          r="94"
          fill="none"
          stroke="#39FF6A"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="22 10 4 10"
        />

        {/* Rotating glyph ring */}
        <g className="sig-a">
          <text
            fill="#39FF6A"
            fillOpacity="0.7"
            fontFamily="var(--font-display), monospace"
            fontSize="11"
            letterSpacing="3.5"
          >
            <textPath href="#sigil-ring" startOffset="0">
              {GLYPHS}
            </textPath>
          </text>
        </g>

        {/* Inner dashed ring, opposite spin */}
        <circle
          className="sig-c"
          cx="110"
          cy="110"
          r="62"
          fill="none"
          stroke="#39FF6A"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray="2 8"
        />

        {/* Crosshair */}
        <g stroke="#39FF6A" strokeOpacity="0.18" strokeWidth="1">
          <line x1="110" y1="14" x2="110" y2="46" />
          <line x1="110" y1="174" x2="110" y2="206" />
          <line x1="14" y1="110" x2="46" y2="110" />
          <line x1="174" y1="110" x2="206" y2="110" />
        </g>

        {/* Core */}
        <circle cx="110" cy="110" r="40" fill="url(#sigil-core)" className="sig-pulse" />
        <circle
          cx="110"
          cy="110"
          r="20"
          fill="none"
          stroke="#7CFFA0"
          strokeOpacity="0.6"
          strokeWidth="1"
          className="sig-c"
          strokeDasharray="3 4"
        />
        <circle cx="110" cy="110" r="3.5" fill="#7CFFA0" className="sig-pulse" />

        {/* Corner brackets */}
        <g stroke="#FFB23E" strokeOpacity="0.5" strokeWidth="1.5" fill="none">
          <path d="M14,30 L14,14 L30,14" />
          <path d="M206,30 L206,14 L190,14" />
          <path d="M14,190 L14,206 L30,206" />
          <path d="M206,190 L206,206 L190,206" />
        </g>
      </svg>
    </div>
  );
}
