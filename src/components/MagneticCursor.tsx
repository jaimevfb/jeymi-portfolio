"use client";

import { useEffect, useRef } from "react";
import { signals } from "@/lib/motion-signals";
import { lerp } from "@/lib/utils";

/**
 * Custom magnetic cursor: a phosphor ring that trails the pointer with eased
 * lag and dilates over interactive targets. Mouse-only — touch/coarse pointers
 * and reduced-motion users keep the native cursor untouched.
 */
export default function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine) return;

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    document.documentElement.classList.add("cursor-hidden");

    let rx = signals.pointerPxX;
    let ry = signals.pointerPxY;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    // Dilate over anything interactive.
    const hoverSel = "a, button, [data-cursor], input, textarea";
    const onOver = (e: Event) => {
      if ((e.target as Element)?.closest?.(hoverSel)) targetScale = 2.4;
    };
    const onOut = (e: Event) => {
      if ((e.target as Element)?.closest?.(hoverSel)) targetScale = 1;
    };
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);

    const ease = reduced ? 1 : 0.18;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx = lerp(rx, signals.pointerPxX, ease);
      ry = lerp(ry, signals.pointerPxY, ease);
      scale = lerp(scale, targetScale, 0.12);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      dot.style.transform = `translate3d(${signals.pointerPxX}px, ${signals.pointerPxY}px, 0) translate(-50%, -50%)`;
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-phosphor/70 mix-blend-screen transition-[border-color] duration-300"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1 w-1 rounded-full bg-phosphor"
      />
    </>
  );
}
