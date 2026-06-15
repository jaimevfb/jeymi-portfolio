"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { about } from "@/lib/about";
import { site } from "@/lib/site";
import DecodeText from "./DecodeText";
import RainBackdrop from "./RainBackdrop";
import PortraitDecrypt from "./PortraitDecrypt";

/**
 * Full-screen "About Me" dossier. Opens on the global `open-about` event
 * (dispatched by the hero button + About section), so triggers stay decoupled.
 *
 * Scroll: the panel is its own scroll container marked `data-lenis-prevent`,
 * so Lenis releases the wheel and the dossier scrolls natively (the previous
 * "can't scroll" bug). Background scroll is locked while open.
 *
 * a11y: Esc closes, backdrop click closes, focus moves to Close on open and
 * restores on close. Entrance animation is skipped under reduced motion.
 */

const SECTION = "border-t border-bone/10 pt-8";
const LABEL =
  "font-display text-micro uppercase tracking-[0.3em] text-phosphor/70";

export default function AboutOverlay() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener("open-about", onOpen);
    return () => window.removeEventListener("open-about", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("modal-open");
    const t = window.setTimeout(() => closeRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.documentElement.classList.remove("modal-open");
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // data-lenis-prevent → native scroll inside the modal (fixes Lenis
          // swallowing the wheel). Scrollable container.
          data-lenis-prevent
          className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-void/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`About ${site.name}`}
        >
          {/* Signature rain behind the dossier — fixed to the viewport so it
              stays put while the content scrolls over it. */}
          <div
            className="pointer-events-none fixed inset-0 z-0"
            aria-hidden="true"
          >
            <RainBackdrop opacity={0.32} density={0.9} interactive={false} defer={false} />
          </div>

          {/* Sticky control bar — Close always reachable while scrolling. */}
          <div className="sticky top-0 z-20 border-b border-bone/10 bg-void/70 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-gutter py-4">
              <span className="font-display text-caption uppercase tracking-[0.25em] text-phosphor">
                // dossier — {site.name}
              </span>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 border border-bone/20 px-3 py-1.5 font-display text-micro uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-phosphor hover:text-phosphor"
              >
                Close <span className="text-phosphor">[ESC]</span>
              </button>
            </div>
          </div>

          <motion.div
            className="relative z-10 mx-auto max-w-5xl px-gutter pb-28"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            {/* ── Hero block ── */}
            <section className="grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr]">
              {about.portrait ? (
                <PortraitDecrypt
                  src={about.portrait}
                  alt={`${site.name} — portrait`}
                />
              ) : (
                <div className="relative mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center border border-bone/15 bg-void-100">
                  <span className="px-6 text-center font-display text-caption uppercase tracking-[0.2em] text-bone-faint">
                    [REPLACE: portrait 4:5]
                  </span>
                </div>
              )}

              <div>
                <p className={LABEL}>About</p>
                <h2 className="mt-4 font-display text-h1 font-extrabold uppercase leading-[0.9] text-bone glow-phosphor">
                  <DecodeText text={site.name} speed={42} />
                </h2>
                <p className="mt-4 font-display text-lead text-bone">
                  {about.fullName}
                </p>
                <p className="mt-2 font-display text-caption uppercase tracking-[0.2em] text-phosphor">
                  {about.title}
                </p>
                <p className="mt-5 max-w-prose text-lead text-bone-dim">
                  {about.tagline}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={`mailto:${site.email}`}
                    className="group inline-flex items-center gap-2 border border-phosphor/60 bg-phosphor/5 px-6 py-3 font-display text-caption uppercase tracking-[0.2em] text-phosphor transition-colors duration-300 hover:bg-phosphor hover:text-void"
                  >
                    <span>&gt;_</span> Email me
                  </a>
                  <a
                    href="/jeymi-cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-bone/20 px-6 py-3 font-display text-caption uppercase tracking-[0.2em] text-bone-dim transition-colors duration-300 hover:border-phosphor hover:text-phosphor"
                  >
                    ↓ Download CV
                  </a>
                </div>
              </div>
            </section>

            {/* ── Profile ── */}
            <section className={`${SECTION} mt-4`}>
              <p className={LABEL}>01 — Profile</p>
              <div className="mt-6 max-w-prose space-y-5">
                {about.bio.map((p, i) => (
                  <p key={i} className="text-lead text-bone-dim">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* ── At a glance ── */}
            <section className={`${SECTION} mt-16`}>
              <p className={LABEL}>02 — At a glance</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {about.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="font-display text-micro uppercase tracking-[0.2em] text-bone-faint">
                      {f.label}
                    </dt>
                    <dd className="mt-2 font-display text-body text-bone">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* ── What I do + Toolkit ── */}
            <section className={`${SECTION} mt-16 grid grid-cols-1 gap-12 md:grid-cols-2`}>
              <div>
                <p className={LABEL}>03 — What I do</p>
                <ul className="mt-6 space-y-3">
                  {about.disciplines.map((d) => (
                    <li
                      key={d}
                      className="flex items-baseline gap-3 font-display text-lead text-bone"
                    >
                      <span className="text-phosphor">›</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={LABEL}>Toolkit</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {about.tools.map((t) => (
                    <li
                      key={t}
                      className="border border-bone/15 px-3 py-1.5 font-display text-caption text-bone-dim transition-colors hover:border-phosphor/50 hover:text-bone"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── Experience ── */}
            <section className={`${SECTION} mt-16`}>
              <p className={LABEL}>04 — Experience</p>
              <ol className="mt-8 space-y-0">
                {about.experience.map((e, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-1 gap-1 border-b border-bone/10 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline"
                  >
                    <div>
                      <span className="font-display text-h3 font-bold text-bone">
                        {e.role}
                      </span>
                      <span className="mt-1 block text-caption text-bone-dim">
                        {e.org}
                      </span>
                    </div>
                    <span className="font-display text-caption uppercase tracking-[0.15em] text-phosphor/70">
                      {e.period}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Education ── */}
            <section className={`${SECTION} mt-16`}>
              <p className={LABEL}>05 — Education</p>
              <ul className="mt-6 space-y-5">
                {about.education.map((e, i) => (
                  <li key={i}>
                    <span className="block font-display text-lead text-bone">
                      {e.program}
                    </span>
                    <span className="mt-1 block text-caption text-bone-dim">
                      {e.school}
                      {e.period ? ` · ${e.period}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── CTA footer ── */}
            <section className={`${SECTION} mt-20`}>
              <h3 className="font-display text-h2 font-extrabold uppercase leading-[0.95] text-bone">
                <DecodeText text="LET’S BUILD" trigger="load" speed={34} />{" "}
                <span className="text-phosphor">2026.</span>
              </h3>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href={`mailto:${site.email}`}
                  className="font-display text-lead lowercase text-bone underline-offset-8 transition-colors hover:text-phosphor hover:underline"
                >
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phone}`}
                  className="font-display text-lead text-bone underline-offset-8 transition-colors hover:text-phosphor hover:underline"
                >
                  {site.phoneDisplay}
                </a>
                <span className="hidden h-4 w-px bg-bone/20 sm:block" />
                <ul className="flex flex-wrap gap-x-6 gap-y-2 font-display text-caption uppercase tracking-[0.15em]">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bone-dim transition-colors hover:text-phosphor"
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Helper for trigger buttons elsewhere. */
export function openAbout() {
  window.dispatchEvent(new Event("open-about"));
}
