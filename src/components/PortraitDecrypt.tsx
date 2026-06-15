"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Interactive "decrypt the subject" portrait. The photo sits behind an obscured
 * phosphor-CRT ghost; a soft reveal-circle follows the pointer (hover/drag) to
 * scan it clear. Touch-friendly (drag), and under reduced motion the photo just
 * shows. Styling lives in globals.css (.portrait-reveal / -scanlines / -sweep).
 */
export default function PortraitDecrypt({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const reveal = useRef<HTMLDivElement>(null);
  const [scanned, setScanned] = useState(false);

  const move = (e: React.PointerEvent) => {
    const el = reveal.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    on(); // any movement scans it clear (robust across enter/touch)
  };
  const on = () => {
    reveal.current?.classList.add("is-on");
    if (!scanned) setScanned(true);
  };
  const off = () => reveal.current?.classList.remove("is-on");

  return (
    <figure
      onPointerMove={move}
      onPointerEnter={on}
      onPointerDown={(e) => {
        on();
        move(e);
      }}
      onPointerLeave={off}
      className="group relative mx-auto aspect-[4/5] w-full max-w-sm cursor-crosshair select-none overflow-hidden border border-bone/15 bg-void-100"
    >
      {/* Obscured base — green CRT ghost */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 90vw, 40vw"
        priority
        className="object-cover brightness-[0.42] contrast-125 grayscale"
        draggable={false}
      />
      <span
        className="pointer-events-none absolute inset-0 mix-blend-color"
        style={{ background: "rgba(57,255,106,0.35)" }}
        aria-hidden="true"
      />

      {/* Reveal layer — true colour, masked to a circle at the pointer */}
      <div ref={reveal} className="portrait-reveal absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* CRT scanlines + scanning sweep */}
      <span className="portrait-scanlines pointer-events-none absolute inset-0" aria-hidden="true" />
      <span className="portrait-sweep pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />

      {/* Bottom fade for caption legibility */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{ background: "linear-gradient(to top, rgba(7,10,7,0.85), transparent)" }}
        aria-hidden="true"
      />

      {/* HUD corners */}
      <span className="pointer-events-none absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2 border-phosphor/70" aria-hidden="true" />
      <span className="pointer-events-none absolute right-2 top-2 h-6 w-6 border-r-2 border-t-2 border-phosphor/70" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 border-phosphor/70" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2 border-phosphor/70" aria-hidden="true" />

      <span className="absolute left-3 top-3 font-display text-micro uppercase tracking-[0.2em] text-phosphor/80">
        // subject
      </span>

      {/* Prompt — fades once they start scanning */}
      <span
        className={
          "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap border border-phosphor/40 bg-void/60 px-3 py-1.5 font-display text-micro uppercase tracking-[0.2em] text-phosphor backdrop-blur-sm transition-opacity duration-500 " +
          (scanned ? "opacity-0" : "animate-pulse opacity-100")
        }
      >
        ▓ drag to decrypt ▓
      </span>
    </figure>
  );
}
