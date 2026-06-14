"use client";

import { useEffect, useRef } from "react";

/**
 * A dense Matrix-style code-rain that overlays a single work card WHILE hovered.
 * Mounted only on hover (parent conditionally renders it), so at most one or two
 * run at a time — cheap. Brighter + faster than the ambient page rain for a
 * punchy "decrypting" hit. Skipped entirely under reduced motion.
 */
const GLYPHS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾅﾆﾇﾈﾉ0123456789:=+*".split("");

export default function CardMatrix() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const fontSize = 14;
    let cols = 0;
    let drops: number[] = [];
    let w = 0;
    let h = 0;

    const setup = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `700 ${fontSize}px var(--font-display), monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / fontSize);
      // Start high so the rain sweeps down into view on hover.
      drops = new Array(cols)
        .fill(0)
        .map(() => Math.floor((Math.random() * -h) / fontSize));
    };
    setup();

    let raf = 0;
    let last = 0;
    const step = 1000 / 30;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < step) return;
      last = now;

      ctx.fillStyle = "rgba(7,10,7,0.18)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const roll = Math.random();
        ctx.fillStyle =
          roll > 0.97 ? "#FFFFFF" : roll > 0.9 ? "#7CFFA0" : "#39FF6A";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
        drops[i] += 0.9 + Math.random() * 0.6;
        if (y > h && Math.random() > 0.94) drops[i] = Math.floor(Math.random() * -8);
      }
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
      style={{ opacity: 0.85 }}
    />
  );
}
