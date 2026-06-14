"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { projects, type Project } from "@/lib/projects";
import DecodeText from "./DecodeText";
import CardMatrix from "./CardMatrix";
import PosterLightbox from "./PosterLightbox";

/**
 * Posters showcase as a constant, side-to-side slideshow (marquee).
 * - Two rows drift in opposite directions, never static.
 * - Hovering pauses the rows so a poster can be clicked.
 * - Click any poster → zoom it open in the lightbox.
 * - Reduced motion: rows stop animating and become manually scrollable.
 */
export default function WorkMarquee() {
  const [active, setActive] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const open = (slug: string) =>
    setActive(projects.findIndex((p) => p.slug === slug));
  const close = () => setActive(null);

  // Split into two rows for visual richness; each row loops on its own.
  const rowA = projects.filter((_, i) => i % 2 === 0);
  const rowB = projects.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="work"
      className="relative scroll-mt-24 overflow-hidden py-section"
    >
      {/* Header */}
      <div className="mx-auto mb-12 max-w-shell px-gutter">
        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-display text-caption uppercase tracking-[0.3em] text-phosphor">
              01 — Selected Work
            </p>
            <h2 className="font-display text-h1 font-extrabold uppercase leading-[0.9] text-bone">
              <DecodeText text="THE" trigger="view" speed={30} />{" "}
              <DecodeText
                text="ARCHIVE"
                trigger="view"
                delay={180}
                speed={30}
                className="text-phosphor"
              />
            </h2>
          </div>
          <p className="font-display text-caption uppercase tracking-[0.18em] text-bone-faint">
            <span className="text-phosphor">›</span>{" "}
            {reduced ? "Swipe the rows" : "Always moving"} · click to zoom
          </p>
        </div>
      </div>

      {/* Two drifting rows — auto-scroll, drag/swipe to scrub */}
      <div className="flex flex-col gap-6">
        <MarqueeRow items={rowA} reduced={reduced} speed={-52} onOpen={open} />
        <MarqueeRow items={rowB} reduced={reduced} speed={42} onOpen={open} />
      </div>

      {/* Edge fades so posters dissolve into the void at the margins */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12vw]"
        style={{
          background: "linear-gradient(to right, var(--void), transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12vw]"
        style={{
          background: "linear-gradient(to left, var(--void), transparent)",
        }}
        aria-hidden="true"
      />

      <AnimatePresence>
        {active !== null && (
          <PosterLightbox
            projects={projects}
            index={active}
            onClose={close}
            onSelect={setActive}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * One looping row. Auto-drifts at `speed` px/sec (signed = direction); pauses
 * on hover; drag / swipe to scrub with momentum. Seamless wrap via translateX
 * modulo one copy's width. Reduced motion → static, natively scrollable.
 */
function MarqueeRow({
  items,
  reduced,
  speed,
  onOpen,
}: {
  items: Project[];
  reduced: boolean;
  speed: number;
  onOpen: (slug: string) => void;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const state = useRef({
    offset: 0,
    vel: 0, // momentum (px/frame)
    pressing: false,
    dragging: false,
    paused: false,
    visible: true,
    startX: 0,
    lastX: 0,
    moved: 0,
    copy: 0,
    t: 0,
  });

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    const s = state.current;
    const measure = () => {
      s.copy = track.scrollWidth / 2; // two identical copies
    };
    measure();
    window.addEventListener("resize", measure);

    // Pause the loop while the row is off-screen — saves CPU + battery.
    const io = new IntersectionObserver(
      ([e]) => {
        s.visible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(track);

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!s.visible) {
        s.t = 0;
        return;
      }
      const dt = s.t ? Math.min(0.05, (now - s.t) / 1000) : 0;
      s.t = now;
      if (!s.dragging) {
        if (!s.paused) s.offset += speed * dt;
        s.offset += s.vel;
        s.vel *= 0.92;
        if (Math.abs(s.vel) < 0.05) s.vel = 0;
      }
      if (s.copy > 0) {
        let o = s.offset % s.copy;
        if (o > 0) o -= s.copy;
        track.style.transform = `translate3d(${o}px,0,0)`;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, speed]);

  const s = state.current;
  // Press, but DON'T capture yet — a plain tap must reach the poster button
  // so the zoom opens. We only hijack the pointer once a real drag begins.
  const onDown = (e: React.PointerEvent) => {
    if (reduced) return;
    s.pressing = true;
    s.dragging = false;
    s.moved = 0;
    s.vel = 0;
    s.startX = e.clientX;
    s.lastX = e.clientX;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!s.pressing) return;
    const d = e.clientX - s.lastX;
    s.lastX = e.clientX;
    if (!s.dragging) {
      if (Math.abs(e.clientX - s.startX) <= 5) return; // tap, not a drag
      s.dragging = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
    s.offset += d;
    s.vel = d;
    s.moved += Math.abs(d);
  };
  const endDrag = () => {
    s.pressing = false;
    s.dragging = false;
  };

  if (reduced) {
    return (
      <div className="overflow-x-auto px-gutter">
        <ul className="flex w-max">
          {items.map((p) => (
            <li key={p.slug} className="shrink-0 pr-6">
              <PosterTile project={p} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const loop = [...items, ...items];
  return (
    <div
      className="group relative cursor-grab overflow-hidden active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerEnter={() => (s.paused = true)}
      onPointerLeave={() => {
        s.paused = false;
        endDrag();
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // Swallow the click that ends a scrub so it doesn't open the lightbox.
      onClickCapture={(e) => {
        if (s.moved > 6) {
          e.stopPropagation();
          e.preventDefault();
          s.moved = 0;
        }
      }}
    >
      <ul ref={trackRef} className="flex w-max will-change-transform">
        {loop.map((p, i) => (
          <li key={`${p.slug}-${i}`} className="shrink-0 pr-6">
            <PosterTile project={p} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Poster tile — 3D tilt + glossy sheen on hover, Matrix burst, graphic + title. */
function PosterTile({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (slug: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
  const allowTilt = useRef(false);

  useEffect(() => {
    allowTilt.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Pointer-reactive 3D tilt + moving specular sheen.
  const onMove = (e: React.PointerEvent) => {
    if (!allowTilt.current || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 12; // deg
    const ry = (px - 0.5) * 12;
    frameRef.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05)`;
    if (sheenRef.current) {
      sheenRef.current.style.background = `radial-gradient(380px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.28), transparent 60%)`;
    }
  };
  const reset = () => {
    setHovered(false);
    if (frameRef.current)
      frameRef.current.style.transform =
        "perspective(800px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <figure className="w-[clamp(220px,26vw,340px)] [perspective:800px]">
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        onPointerEnter={() => setHovered(true)}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`Zoom ${project.title} — ${project.category}`}
        className="group/tile block w-full focus:outline-none"
        style={{ ["--accent" as string]: project.accentColor }}
      >
        <div
          ref={frameRef}
          className="relative aspect-[4/5] overflow-hidden border border-bone/10 bg-void-100 shadow-xl shadow-black/40 transition-transform duration-300 ease-[var(--ease-terminal)] will-change-transform group-hover/tile:border-bone/30"
        >
          <Image
            src={project.cover}
            alt={`${project.title} — ${project.blurb}`}
            fill
            sizes="(max-width: 768px) 60vw, 26vw"
            unoptimized={project.cover.endsWith(".svg")}
            className="object-cover grayscale-[0.3] transition-[filter] duration-700 ease-[var(--ease-terminal)] group-hover/tile:grayscale-0"
          />
          {hovered && <CardMatrix />}

          {/* Moving specular sheen */}
          <span
            ref={sheenRef}
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover/tile:opacity-100"
            aria-hidden="true"
          />

          {/* Accent glow ring on hover */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
            style={{
              boxShadow:
                "inset 0 0 40px color-mix(in srgb, var(--accent) 22%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* Zoom affordance */}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100">
            <span className="border border-phosphor/70 bg-void/60 px-4 py-2 font-display text-micro uppercase tracking-[0.2em] text-phosphor backdrop-blur-sm">
              ⤢ Zoom
            </span>
          </span>
          <span
            className="pointer-events-none absolute left-0 top-0 h-9 w-9 border-l-2 border-t-2 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
            style={{ borderColor: "var(--accent)" }}
            aria-hidden="true"
          />
        </div>
      </button>
      <figcaption className="mt-3 flex items-baseline justify-between gap-3">
        <span className="font-display text-body font-bold tracking-tight text-bone transition-colors group-hover/tile:text-[color:var(--accent)]">
          {project.title}
        </span>
        <span className="shrink-0 font-display text-micro uppercase tracking-[0.15em] text-bone-faint">
          {project.category}
        </span>
      </figcaption>
    </figure>
  );
}
