"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline phosphor progress bar pinned to the top of the viewport that
 * fills as you scroll the page — a small premium cue. Uses scaleX (compositor-
 * only) and a passive listener, so it's effectively free.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-px bg-transparent"
    >
      <div
        ref={ref}
        className="h-full origin-left bg-phosphor shadow-[0_0_8px_var(--phosphor)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
