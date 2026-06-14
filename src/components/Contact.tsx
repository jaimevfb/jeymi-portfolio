"use client";

import DecodeText from "./DecodeText";
import Magnetic from "./Magnetic";
import { site } from "@/lib/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto max-w-shell scroll-mt-24 overflow-hidden px-gutter py-section"
    >
      <div className="relative z-10 pt-8">
        <p className="font-display text-caption uppercase tracking-[0.3em] text-phosphor">
          03 — Contact
        </p>

        <h2 className="mt-6 font-display text-h1 font-extrabold uppercase leading-[0.9] text-bone">
          <DecodeText text="LET’S MAKE" trigger="view" speed={28} />
          <br />
          <DecodeText
            text="SOMETHING COOL"
            trigger="view"
            delay={180}
            speed={28}
            className="text-phosphor glow-phosphor"
          />
        </h2>

        <p className="mt-8 max-w-prose text-lead text-bone-dim">
          Commissions, collaborations, and the strange briefs welcome. The
          channel is open.
        </p>

        {/* Primary action — oversized magnetic email. */}
        <div className="mt-12">
          <Magnetic strength={0.35}>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-4 font-display text-h2 font-bold lowercase tracking-tight text-bone transition-colors duration-300 hover:text-phosphor"
            >
              <span className="text-phosphor">&gt;_</span>
              <span className="border-b border-bone/20 pb-2 group-hover:border-phosphor">
                {site.email}
              </span>
            </a>
          </Magnetic>
        </div>

        {/* Phone */}
        <a
          href={`tel:${site.phone}`}
          className="group mt-6 inline-flex items-center gap-3 font-display text-lead text-bone-dim transition-colors duration-300 hover:text-phosphor"
        >
          <span className="tracking-wide">{site.phoneDisplay}</span>
        </a>

        {/* Socials */}
        <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-4 font-display text-caption uppercase tracking-[0.18em]">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-bone-dim transition-colors duration-300 hover:text-phosphor"
              >
                <span className="text-phosphor/50 transition-transform duration-300 group-hover:translate-x-0.5">
                  ↗
                </span>
                {s.label}
                <span className="text-bone-faint normal-case">
                  {s.handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
