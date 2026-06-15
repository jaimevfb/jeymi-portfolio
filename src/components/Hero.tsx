"use client";

import Link from "next/link";
import HeroName from "./HeroName";
import TerminalSigil from "./TerminalSigil";
import Magnetic from "./Magnetic";
import { openAbout } from "./AboutOverlay";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pb-12 pt-32"
    >
      {/* Rain now lives in the root layout (page-wide). This vignette keeps
          the headline legible over it. */}
      {/* Top-left vignette mask so headline sits over calmer ground. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 60%, rgba(7,10,7,0.85) 0%, rgba(7,10,7,0.35) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-shell flex-1 grid-cols-12 items-center gap-y-10 px-gutter">
        {/* Headline block — breaks the grid, oversized, left-weighted. */}
        <div className="col-span-12 lg:col-span-8">
          <p className="mb-6 flex items-center gap-3 font-display text-caption uppercase tracking-[0.3em] text-phosphor">
            <span className="inline-block h-px w-10 bg-phosphor/60" />
            {site.role}
          </p>

          {/* The name IS the title — living Matrix nameplate. */}
          <h1 className="font-display text-mega font-extrabold uppercase leading-[0.86] text-bone">
            <HeroName name={site.name} />
          </h1>

          {/* Subheading + blinking caret */}
          <p className="mt-6 font-display text-h3 font-bold uppercase tracking-tight text-phosphor">
            Portfolio 2026
            <span className="animate-blink text-phosphor">█</span>
          </p>

          <p className="mt-7 max-w-prose text-lead text-bone-dim">
            Posters, motion, and identities built to stop the scroll and own the
            room. I turn a brief into a world — and a night into something people
            remember.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic strength={0.5}>
              <Link
                href="/#work"
                className="group relative inline-flex items-center gap-3 border border-phosphor/60 bg-phosphor/5 px-7 py-3.5 font-display text-caption uppercase tracking-[0.2em] text-phosphor transition-colors duration-300 hover:bg-phosphor hover:text-void"
              >
                View Work
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={openAbout}
              className="group inline-flex items-center gap-2 border border-bone/20 px-6 py-3.5 font-display text-caption uppercase tracking-[0.2em] text-bone-dim transition-colors duration-300 hover:border-phosphor hover:text-phosphor"
            >
              <span className="text-phosphor">›</span> About Me
            </button>
          </div>
        </div>

        {/* Right column — interactive system-core sigil + Swiss meta rail. */}
        <div className="col-span-12 hidden flex-col items-center justify-center gap-12 lg:col-span-4 lg:flex">
          <TerminalSigil />
          <aside className="w-full font-display text-micro uppercase tracking-[0.2em] text-bone-faint">
            <div className="border-t rule pt-3">
              <span className="block text-phosphor/70">// Index</span>
              <span className="text-bone-dim">15 selected works</span>
            </div>
            <div className="mt-5 border-t rule pt-3">
              <span className="block text-phosphor/70">// Discipline</span>
              <span className="text-bone-dim">Poster · Motion · Identity</span>
            </div>
            <div className="mt-5 border-t rule pt-3">
              <span className="block text-phosphor/70">// Status</span>
              <span className="text-amber">Open for 2026 opportunities</span>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer rail of the hero — scroll cue + coordinates. */}
      <div className="relative z-10 mx-auto flex w-full max-w-shell items-end justify-between px-gutter">
        <span className="flex items-center gap-3 font-display text-micro uppercase tracking-[0.25em] text-bone-faint">
          <span className="inline-block h-8 w-px animate-pulse bg-phosphor/50" />
          Scroll to decode
        </span>
        <span className="hidden font-display text-micro uppercase tracking-[0.25em] text-bone-faint sm:block">
          N 41.0° / E 29.0° {/* [REPLACE: location, optional] */}
        </span>
      </div>
    </section>
  );
}
