"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import DecodeText from "./DecodeText";
import Reveal from "./Reveal";
import Nav from "./Nav";
import Footer from "./Footer";

export default function ProjectDetail({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  const coverRef = useRef<HTMLDivElement>(null);

  // Subtle scroll parallax on the hero cover — choreographed, not floaty.
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !coverRef.current
    )
      return;
    gsap.registerPlugin(ScrollTrigger);
    const img = coverRef.current.querySelector("[data-parallax]");
    if (!img) return;
    const ctx = gsap.context(() => {
      gsap.to(img, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: coverRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const accent = project.accentColor;

  return (
    <div style={{ ["--accent" as string]: accent }}>
      <Nav />
      <main id="main" className="pt-28">
        {/* Header */}
        <header className="mx-auto max-w-shell px-gutter">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 font-display text-caption uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-phosphor"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to index
          </Link>

          <div className="mt-10 grid grid-cols-12 items-end gap-y-8 border-b border-bone/10 pb-10">
            <div className="col-span-12 lg:col-span-9">
              <p
                className="mb-5 font-display text-caption uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                {project.category} — {project.year}
              </p>
              <h1 className="font-display text-h1 font-extrabold uppercase leading-[0.9] text-bone">
                <DecodeText text={project.title} speed={40} />
              </h1>
            </div>
            <dl className="col-span-12 grid grid-cols-2 gap-6 font-display text-caption lg:col-span-3 lg:grid-cols-1">
              {project.role && (
                <div>
                  <dt className="text-micro uppercase tracking-[0.2em] text-bone-faint">
                    Role
                  </dt>
                  <dd className="mt-1 text-bone">{project.role}</dd>
                </div>
              )}
              {project.client && (
                <div>
                  <dt className="text-micro uppercase tracking-[0.2em] text-bone-faint">
                    Client
                  </dt>
                  <dd className="mt-1 text-bone">{project.client}</dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        {/* Cover — large, with parallax */}
        <section
          ref={coverRef}
          className="mx-auto mt-12 max-w-shell overflow-hidden px-gutter"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden border border-bone/10 bg-void-100">
            {project.video ? (
              <video
                src={project.video}
                poster={project.cover}
                muted
                loop
                autoPlay
                playsInline
                data-parallax
                className="absolute inset-0 h-[120%] w-full object-cover"
              />
            ) : (
              <div data-parallax className="absolute inset-0 h-[120%] w-full">
                <Image
                  src={project.cover}
                  alt={`${project.title} — ${project.blurb}`}
                  fill
                  priority
                  sizes="100vw"
                  unoptimized={project.cover.endsWith(".svg")}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* Body */}
        <section className="mx-auto mt-20 max-w-shell px-gutter">
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 lg:col-span-3">
              <Reveal>
                <p className="font-display text-micro uppercase tracking-[0.25em] text-phosphor/70">
                  // Overview
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <li
                      key={t}
                      className="border border-bone/15 px-3 py-1 font-display text-caption text-bone-dim"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <Reveal>
                <p className="max-w-prose text-lead text-bone">
                  {project.description}
                </p>
              </Reveal>
            </div>
          </div>

          {/* Placeholder gallery — Jeymi drops real spreads here. */}
          <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[0, 1].map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-bone/15 bg-void-100">
                  <span className="font-display text-caption uppercase tracking-[0.2em] text-bone-faint">
                    [REPLACE: detail image {i + 1}]
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Prev / Next */}
        <nav className="mx-auto mt-28 max-w-shell px-gutter">
          <div className="grid grid-cols-2 border-t border-bone/10">
            <Link
              href={`/work/${prev.slug}`}
              className="group py-10 pr-4 transition-colors hover:bg-void-50"
            >
              <span className="font-display text-micro uppercase tracking-[0.2em] text-bone-faint">
                ← Previous
              </span>
              <span className="mt-2 block font-display text-h3 font-bold text-bone transition-colors group-hover:text-phosphor">
                {prev.title}
              </span>
            </Link>
            <Link
              href={`/work/${next.slug}`}
              className="group border-l border-bone/10 py-10 pl-6 text-right transition-colors hover:bg-void-50"
            >
              <span className="font-display text-micro uppercase tracking-[0.2em] text-bone-faint">
                Next →
              </span>
              <span className="mt-2 block font-display text-h3 font-bold text-bone transition-colors group-hover:text-phosphor">
                {next.title}
              </span>
            </Link>
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
