"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CardMatrix from "./CardMatrix";

/**
 * "Decrypt file" portrait. Starts locked behind a Matrix rain veil; pressing
 * DECRYPT runs a progress sequence, then the photo resolves in with a glitch
 * and an ACCESS GRANTED flash. A re-lock control replays it. Reduced motion
 * opens instantly. Keyboard-accessible (the lock/unlock are real buttons).
 */
type Phase = "locked" | "scanning" | "open";

export default function PortraitUnlock({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [phase, setPhase] = useState<Phase>("locked");
  const [pct, setPct] = useState(0);
  const timer = useRef(0);

  const unlock = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setPct(100);
      setPhase("open");
      return;
    }
    setPhase("scanning");
    let p = 0;
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      p += Math.random() * 13 + 6;
      if (p >= 100) {
        p = 100;
        window.clearInterval(timer.current);
        setPct(100);
        window.setTimeout(() => setPhase("open"), 360);
      }
      setPct(Math.floor(p));
    }, 90);
  };

  const relock = () => {
    window.clearInterval(timer.current);
    setPct(0);
    setPhase("locked");
  };

  return (
    <figure className="relative mx-auto aspect-[4/5] w-full max-w-sm select-none overflow-hidden border border-bone/15 bg-void-100">
      {/* Portrait — revealed when open */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div
            key="photo"
            className="absolute inset-0"
            initial={{ opacity: 0, filter: "brightness(2.6) blur(7px)" }}
            animate={{ opacity: 1, filter: "brightness(1) blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
              priority
              draggable={false}
            />
            <span
              className="pointer-events-none absolute inset-0 mix-blend-color"
              style={{ background: "rgba(57,255,106,0.08)" }}
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(to top, rgba(7,10,7,0.9), transparent)",
              }}
              aria-hidden="true"
            />
            {/* ACCESS GRANTED flash */}
            <motion.span
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-phosphor/15 font-display text-caption uppercase tracking-[0.3em] text-phosphor"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              ✓ access granted
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked / scanning veil */}
      <AnimatePresence>
        {phase !== "open" && (
          <motion.div
            key="veil"
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-void/70 text-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CardMatrix />
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 45%, transparent, rgba(7,10,7,0.85))",
              }}
              aria-hidden="true"
            />

            {phase === "locked" ? (
              <div className="relative z-10 flex flex-col items-center gap-4 px-6">
                {/* Padlock */}
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="1.5" stroke="#39FF6A" strokeWidth="1.6" />
                  <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" stroke="#39FF6A" strokeWidth="1.6" />
                  <circle cx="12" cy="15.5" r="1.6" fill="#7CFFA0" />
                </svg>
                <span className="font-display text-micro uppercase tracking-[0.3em] text-phosphor/80">
                  Encrypted // subject
                </span>
                <button
                  onClick={unlock}
                  className="group inline-flex items-center gap-2 border border-phosphor/60 bg-phosphor/10 px-5 py-2.5 font-display text-caption uppercase tracking-[0.2em] text-phosphor transition-colors duration-300 hover:bg-phosphor hover:text-void"
                >
                  <span>▸</span> Decrypt file
                </button>
              </div>
            ) : (
              <div className="relative z-10 w-3/4 max-w-[200px]">
                <div className="flex items-baseline justify-between font-display text-micro uppercase tracking-[0.25em] text-phosphor">
                  <span>Decrypting</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-2 h-px w-full bg-bone/15">
                  <div
                    className="h-full bg-phosphor shadow-[0_0_8px_var(--phosphor)] transition-[width] duration-100"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline veil + HUD corners (always on) */}
      <span className="hud-scan pointer-events-none absolute inset-0 z-[5] opacity-50" aria-hidden="true" />
      <span className="pointer-events-none absolute left-2 top-2 z-[6] h-6 w-6 border-l-2 border-t-2 border-phosphor/70" aria-hidden="true" />
      <span className="pointer-events-none absolute right-2 top-2 z-[6] h-6 w-6 border-r-2 border-t-2 border-phosphor/70" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-2 left-2 z-[6] h-6 w-6 border-b-2 border-l-2 border-phosphor/70" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-2 right-2 z-[6] h-6 w-6 border-b-2 border-r-2 border-phosphor/70" aria-hidden="true" />

      {/* Re-lock control when open */}
      {phase === "open" && (
        <button
          onClick={relock}
          aria-label="Re-encrypt"
          className="absolute bottom-3 right-3 z-[6] flex items-center gap-1.5 border border-bone/20 bg-void/60 px-2.5 py-1 font-display text-micro uppercase tracking-[0.2em] text-bone-dim backdrop-blur-sm transition-colors hover:border-phosphor hover:text-phosphor"
        >
          ⟲ Lock
        </button>
      )}
    </figure>
  );
}
