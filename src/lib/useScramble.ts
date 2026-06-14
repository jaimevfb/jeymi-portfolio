"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ｱｲｳｴｵｶｷ01<>/=+*┼⌁ＡＢＣ█▓";

/**
 * Returns the live display string for `text` plus a `scramble()` trigger.
 * Calling scramble() runs a short decrypt animation that resolves back to the
 * original text — used for "decrypt on hover" project titles.
 * Honors reduced motion (resolves instantly).
 */
export function useScramble(text: string, durationMs = 520) {
  const [value, setValue] = useState(text);
  const raf = useRef(0);

  const scramble = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(text);
      return;
    }
    cancelAnimationFrame(raf.current);
    let start = 0;
    const chars = text.split("");
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / durationMs);
      const settled = Math.floor(p * chars.length);
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === " ") out += " ";
        else if (i < settled) out += chars[i];
        else out += CHARS[(Math.random() * CHARS.length) | 0];
      }
      setValue(out);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setValue(text);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, durationMs]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { value, scramble };
}
