"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { Project } from "@/lib/projects";
import RainBackdrop from "./RainBackdrop";

/**
 * Full-screen "zoom" view of a poster, opened from the marquee.
 *  • Matrix rain persists behind the artwork.
 *  • Filmstrip of every poster along the bottom (click to jump).
 *  • Swipe left/right (touch + drag) to move between posters.
 *  • Subtle parallax tilt on the poster (fine pointer).
 *  • Keyboard: Esc closes, ←/→ navigate. Backdrop click closes. Scroll locked.
 */
export default function PosterLightbox({
  projects,
  index,
  onClose,
  onSelect,
}: {
  projects: Project[];
  index: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const n = projects.length;
  const project = projects[index];
  const prev = () => onSelect((index - 1 + n) % n);
  const next = () => onSelect((index + 1) % n);

  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("modal-open");
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.documentElement.classList.remove("modal-open");
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, onSelect, index, n]);

  const isSvg = project.cover.endsWith(".svg");

  // Parallax tilt (fine pointer only).
  const onFigMove = (e: React.PointerEvent) => {
    const el = figRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg)`;
  };
  const onFigLeave = () => {
    if (figRef.current)
      figRef.current.style.transform =
        "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  };

  // Swipe / drag to navigate.
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col bg-void/90 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — enlarged`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ ["--accent" as string]: project.accentColor }}
    >
      {/* Matrix rain persists behind the zoom. */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <RainBackdrop
          opacity={0.42}
          density={1.15}
          interactive={false}
          defer={false}
        />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-gutter py-5">
        <span className="font-display text-caption uppercase tracking-[0.25em] text-phosphor">
          // {project.category} — {project.year} · {String(index + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          className="flex items-center gap-2 border border-bone/20 px-3 py-1.5 font-display text-micro uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-phosphor hover:text-phosphor"
        >
          Close <span className="text-phosphor">[ESC]</span>
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative z-10 flex flex-1 items-center justify-center px-gutter pb-2"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        <button
          onClick={prev}
          aria-label="Previous poster"
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 px-4 py-6 font-display text-h3 text-bone-dim transition-colors hover:text-phosphor sm:left-6"
        >
          ←
        </button>

        <motion.figure
          key={project.slug}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-h-full flex-col items-center"
        >
          <div
            ref={figRef}
            onPointerMove={onFigMove}
            onPointerLeave={onFigLeave}
            className="relative border border-bone/15 transition-transform duration-200 ease-out will-change-transform"
            style={{
              boxShadow:
                "0 0 60px color-mix(in srgb, var(--accent) 22%, transparent)",
            }}
          >
            {project.video ? (
              <video
                src={project.video}
                poster={project.cover}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="max-h-[64vh] w-auto max-w-[88vw]"
              />
            ) : (
              <Image
                src={project.cover}
                alt={`${project.title} — ${project.blurb}`}
                width={1080}
                height={1350}
                unoptimized={isSvg}
                className="h-auto max-h-[64vh] w-auto max-w-[88vw] object-contain"
                priority
              />
            )}
          </div>
          <figcaption className="mt-4 text-center">
            <span className="font-display text-h3 font-bold text-bone">
              {project.title}
            </span>
            <span className="mt-1 block max-w-prose text-caption text-bone-dim">
              {project.blurb}
            </span>
          </figcaption>
        </motion.figure>

        <button
          onClick={next}
          aria-label="Next poster"
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 px-4 py-6 font-display text-h3 text-bone-dim transition-colors hover:text-phosphor sm:right-6"
        >
          →
        </button>
      </div>

      {/* Filmstrip */}
      <div className="relative z-10 border-t border-bone/10 bg-void/40 px-gutter py-3">
        <ul className="mx-auto flex max-w-shell gap-2 overflow-x-auto pb-1">
          {projects.map((p, i) => (
            <li key={p.slug} className="shrink-0">
              <button
                onClick={() => onSelect(i)}
                aria-label={`View ${p.title}`}
                aria-current={i === index}
                className={
                  "relative block h-16 w-[3.4rem] overflow-hidden border transition-all duration-200 sm:h-20 sm:w-16 " +
                  (i === index
                    ? "border-phosphor opacity-100"
                    : "border-bone/15 opacity-50 hover:opacity-90")
                }
              >
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  sizes="64px"
                  unoptimized={p.cover.endsWith(".svg")}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
