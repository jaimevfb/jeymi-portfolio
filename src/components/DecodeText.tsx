"use client";

import { useEffect, useRef, useState, createElement } from "react";
import { cn } from "@/lib/utils";

/**
 * DECODE TEXT — "resolving from noise" reveal.
 *
 * Each character scrambles through random glyphs, then settles to its final
 * form, staggered across the string. Fires on load or when scrolled into view.
 *
 * Accessibility:
 *   • The real text is exposed via aria-label; the animated glyphs are
 *     aria-hidden, so assistive tech reads clean copy.
 *   • prefers-reduced-motion → renders final text instantly, no loop.
 */

const SCRAMBLE = "ｱｲｳｴｵｶｷ01<>/=+*┼⌁01ＡＢＣＤ█▓▒";

type Trigger = "load" | "view";

interface Props {
  text: string;
  as?: keyof HTMLElementTagNameMap;
  trigger?: Trigger;
  /** ms before the reveal starts. */
  delay?: number;
  /** ms per character settle window. Lower = snappier. */
  speed?: number;
  className?: string;
  glow?: boolean;
}

export default function DecodeText({
  text,
  as = "span",
  trigger = "load",
  delay = 0,
  speed = 38,
  className,
  glow = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const [armed, setArmed] = useState(trigger === "load");
  const doneRef = useRef(false);

  // Arm on scroll-into-view when requested.
  useEffect(() => {
    if (trigger !== "view" || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  useEffect(() => {
    if (!armed || doneRef.current) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setDisplay(text);
      doneRef.current = true;
      return;
    }

    const chars = text.split("");
    const total = delay + chars.length * speed + 360;
    let start = 0;
    let raf = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const settleAt = delay + i * speed + 280;
        if (chars[i] === " ") {
          out += " ";
        } else if (t >= settleAt) {
          out += chars[i];
        } else if (t < delay + i * speed) {
          out += chars[i] === " " ? " " : "";
        } else {
          out += SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
        }
      }
      setDisplay(out);
      if (t < total) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        doneRef.current = true;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, text, delay, speed]);

  return createElement(
    as,
    {
      ref,
      "aria-label": text,
      className: cn(glow && "glow-phosphor", className),
    },
    <span aria-hidden="true">{display}</span>
  );
}
