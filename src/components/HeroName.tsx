"use client";

import { useEffect, useRef } from "react";

/**
 * The hero nameplate — Matrix "resolving from noise" decode.
 *  • Decodes in on load, re-decodes on a slow loop (visible after the intro
 *    loader lifts) and on hover.
 *  • Settles into a polished off-white letterform with a phosphor sheen
 *    (.name-plate in globals.css).
 *
 * Perf: the scramble writes straight to the DOM via a ref — no per-frame React
 * state, so the slow loop costs nothing in the React tree. Reduced motion:
 * renders the name once, no loops.
 */
const GLYPHS = "ｱｲｳｴｵｶｷｸ01<>/=+*ＡＢＣＤＥ".split("");
const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export default function HeroName({ name }: { name: string }) {
  const out = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = out.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = name;
      return;
    }

    const chars = name.split("");
    const decode = (duration: number) => {
      cancelAnimationFrame(raf.current);
      let start = 0;
      const tick = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        const settle = p * chars.length;
        let s = "";
        for (let i = 0; i < chars.length; i++) {
          s += i < settle ? chars[i] : rnd();
        }
        if (out.current) out.current.textContent = s;
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else if (out.current) out.current.textContent = name;
      };
      raf.current = requestAnimationFrame(tick);
    };

    decode(1100);
    const loop = window.setInterval(() => decode(620), 5200);

    const onEnter = () => decode(460);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("focus", onEnter);

    return () => {
      cancelAnimationFrame(raf.current);
      window.clearInterval(loop);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("focus", onEnter);
    };
  }, [name]);

  return (
    <span
      className="name-plate inline-block cursor-default"
      tabIndex={0}
      aria-label={name}
    >
      <span ref={out} aria-hidden="true">
        {name}
      </span>
    </span>
  );
}
