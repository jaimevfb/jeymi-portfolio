"use client";

import { useEffect, useState } from "react";

/**
 * Fixed scroll-spy dock — a terminal HUD rail on the right edge that tracks the
 * active section (IntersectionObserver) and jumps to it on click. Ticks widen +
 * brighten when active; labels reveal on hover/active. Desktop only; cheap.
 */
const SECTIONS = [
  { id: "top", label: "Index" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function SectionDock() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      // "Active" = the section crossing the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            aria-current={on}
            className="group flex items-center gap-3"
          >
            <span
              className={
                "font-display text-micro uppercase tracking-[0.25em] transition-all duration-300 " +
                (on
                  ? "text-phosphor opacity-100"
                  : "text-bone-faint opacity-0 group-hover:opacity-100")
              }
            >
              {s.label}
            </span>
            <span
              className={
                "block h-px transition-all duration-300 " +
                (on
                  ? "w-8 bg-phosphor shadow-[0_0_8px_var(--phosphor)]"
                  : "w-4 bg-bone-faint group-hover:w-6 group-hover:bg-phosphor/60")
              }
            />
          </button>
        );
      })}
    </nav>
  );
}
