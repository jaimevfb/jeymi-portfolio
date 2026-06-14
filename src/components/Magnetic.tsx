"use client";

import { useRef, type ReactNode } from "react";
import { lerp } from "@/lib/utils";

/**
 * Wraps a child and gently pulls it toward the pointer while hovered —
 * the classic "magnetic" affordance for primary actions. Pointer-fine only;
 * springs back on leave. No-ops under reduced motion (transform stays at 0).
 */
export default function Magnetic({
  children,
  strength = 0.4,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transform = "translate(0px, 0px)";
  };

  return (
    <span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={`inline-block transition-transform duration-500 ease-[var(--ease-terminal)] ${className}`}
    >
      {children}
    </span>
  );
}
