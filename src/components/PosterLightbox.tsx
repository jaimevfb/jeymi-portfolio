"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Project } from "@/lib/projects";
import RainBackdrop from "./RainBackdrop";
import DecodeText from "./DecodeText";

/**
 * Full-screen poster "case file" — HUD presentation over the signature rain.
 * Perf: the poster + info reveal TOGETHER, gated on the image decoding (a light
 * loader shows meanwhile, no text-before-image pop). Neighbours are preloaded
 * so ←/→ navigation is instant. The entrance is opacity/transform only (no
 * filter) to avoid jank.
 */
const IMG_SIZES = "(max-width: 1024px) 86vw, 44vw";

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
  const [ready, setReady] = useState(false);

  const n = projects.length;
  const project = projects[index];
  const prevI = (index - 1 + n) % n;
  const nextI = (index + 1) % n;
  const prev = () => onSelect(prevI);
  const next = () => onSelect(nextI);

  // Reset the "ready" gate whenever the poster changes. Safety fallback reveals
  // it after a moment in case onLoad never fires (e.g. cached before bind).
  useEffect(() => {
    setReady(false);
    const t = window.setTimeout(() => setReady(true), 1300);
    return () => window.clearTimeout(t);
  }, [index]);

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

  const onFigMove = (e: React.PointerEvent) => {
    const el = figRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg)`;
  };
  const onFigLeave = () => {
    if (figRef.current)
      figRef.current.style.transform =
        "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

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

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col bg-void/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — enlarged`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ ["--accent" as string]: project.accentColor }}
    >
      {/* Designed backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <RainBackdrop opacity={0.32} density={0.9} interactive={false} defer={false} />
      </div>
      <div className="hud-grid pointer-events-none absolute inset-0 z-0 opacity-60" aria-hidden="true" />
      <div className="hud-scan pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true" />
      <span className="pointer-events-none absolute left-4 top-4 z-[15] h-8 w-8 border-l border-t border-phosphor/40" aria-hidden="true" />
      <span className="pointer-events-none absolute right-4 top-4 z-[15] h-8 w-8 border-r border-t border-phosphor/40" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-4 left-4 z-[15] h-8 w-8 border-b border-l border-phosphor/40" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-4 right-4 z-[15] h-8 w-8 border-b border-r border-phosphor/40" aria-hidden="true" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-gutter py-4">
        <span className="font-display text-caption uppercase tracking-[0.25em] text-phosphor">
          // file {counter}
        </span>
        <span className="hidden font-display text-micro uppercase tracking-[0.2em] text-bone-faint sm:block">
          {project.client ?? "Parallel Dimensions"}
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
        className="relative z-10 flex flex-1 items-center justify-center overflow-hidden px-gutter pb-2"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        {/* Loader while the poster decodes */}
        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-3">
            <span className="font-display text-micro uppercase tracking-[0.3em] text-phosphor/80">
              ▓ decrypting ▓
            </span>
            <span className="h-px w-32 overflow-hidden bg-bone/15">
              <span className="block h-full w-1/2 animate-[marquee_0.9s_linear_infinite] bg-phosphor" />
            </span>
          </div>
        )}

        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-1 top-1/2 z-20 -translate-y-1/2 px-3 py-6 font-display text-h3 text-bone-dim transition-colors hover:text-phosphor lg:left-2"
        >
          ←
        </button>

        {/* Poster + info reveal together once the image is decoded */}
        <motion.div
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-[auto_minmax(260px,1fr)]"
        >
          {/* Poster */}
          <figure className="mx-auto">
            <div
              ref={figRef}
              onPointerMove={onFigMove}
              onPointerLeave={onFigLeave}
              className="relative overflow-hidden border border-bone/15 transition-transform duration-200 ease-out will-change-transform"
              style={{
                boxShadow:
                  "0 0 70px color-mix(in srgb, var(--accent) 26%, transparent)",
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
                  onLoadedData={() => setReady(true)}
                  className="max-h-[58vh] w-auto max-w-[86vw] lg:max-w-[44vw]"
                />
              ) : (
                <Image
                  src={project.cover}
                  alt={`${project.title} — ${project.blurb}`}
                  width={1080}
                  height={1350}
                  sizes={IMG_SIZES}
                  unoptimized={isSvg}
                  priority
                  onLoad={() => setReady(true)}
                  className="h-auto max-h-[58vh] w-auto max-w-[86vw] object-contain lg:max-w-[44vw]"
                />
              )}
              <span className="portrait-sweep pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
              <span className="pointer-events-none absolute left-1.5 top-1.5 h-5 w-5 border-l-2 border-t-2 opacity-80" style={{ borderColor: "var(--accent)" }} aria-hidden="true" />
              <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-5 w-5 border-b-2 border-r-2 opacity-80" style={{ borderColor: "var(--accent)" }} aria-hidden="true" />
            </div>
          </figure>

          {/* Info panel */}
          <aside className="max-w-prose text-center lg:text-left">
            <p
              className="font-display text-micro uppercase tracking-[0.3em]"
              style={{ color: project.accentColor }}
            >
              {project.category} · {project.year}
            </p>
            <h2 className="mt-3 font-display text-h2 font-extrabold uppercase leading-[0.95] text-bone">
              {ready ? <DecodeText text={project.title} speed={32} /> : project.title}
            </h2>
            <p className="mt-4 text-lead text-bone-dim">{project.blurb}</p>
            <p className="mt-3 hidden text-caption leading-relaxed text-bone-faint sm:block">
              {project.description}
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="border border-bone/15 px-2.5 py-1 font-display text-micro uppercase tracking-[0.15em] text-bone-dim"
                >
                  {t}
                </li>
              ))}
            </ul>
            {project.role && (
              <p className="mt-5 font-display text-micro uppercase tracking-[0.2em] text-bone-faint">
                <span className="text-phosphor/70">// role</span> {project.role}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
              <button
                onClick={prev}
                className="border border-bone/20 px-4 py-2 font-display text-micro uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-phosphor hover:text-phosphor"
              >
                ◂ Prev
              </button>
              <button
                onClick={next}
                className="border border-phosphor/50 bg-phosphor/5 px-4 py-2 font-display text-micro uppercase tracking-[0.2em] text-phosphor transition-colors hover:bg-phosphor hover:text-void"
              >
                Next ▸
              </button>
            </div>
          </aside>
        </motion.div>

        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-1 top-1/2 z-20 -translate-y-1/2 px-3 py-6 font-display text-h3 text-bone-dim transition-colors hover:text-phosphor lg:right-2"
        >
          →
        </button>

        {/* Preload neighbours so navigation is instant (offscreen, same URL). */}
        <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          {[prevI, nextI].map((i) =>
            projects[i].video ? null : (
              <Image
                key={projects[i].slug}
                src={projects[i].cover}
                alt=""
                width={1080}
                height={1350}
                sizes={IMG_SIZES}
                unoptimized={projects[i].cover.endsWith(".svg")}
                priority
              />
            )
          )}
        </div>
      </div>

      {/* Filmstrip reel */}
      <div className="relative z-10 border-t border-phosphor/15 bg-void/40 px-gutter py-3">
        <ul className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1">
          {projects.map((p, i) => (
            <li key={p.slug} className="shrink-0">
              <button
                onClick={() => onSelect(i)}
                aria-label={`View ${p.title}`}
                aria-current={i === index}
                className={
                  "relative block h-14 w-[2.9rem] overflow-hidden border transition-all duration-200 sm:h-16 sm:w-[3.2rem] " +
                  (i === index
                    ? "scale-105 border-phosphor opacity-100"
                    : "border-bone/15 opacity-45 hover:opacity-90")
                }
              >
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  sizes="56px"
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
