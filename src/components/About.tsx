import DecodeText from "./DecodeText";
import Reveal from "./Reveal";
import OpenAboutButton from "./OpenAboutButton";
import { about } from "@/lib/about";

// Disciplines mirror the dossier; notes add a touch of detail.
const services = [
  { k: "01", label: "Poster & Key Art", note: "Event posters, lineup & ticket art" },
  { k: "02", label: "Motion Graphics", note: "Title cards, animated key art, loops" },
  { k: "03", label: "Visual Identity", note: "Event branding, marks & type" },
  { k: "04", label: "UI/UX Design", note: "Web & product interfaces" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-shell scroll-mt-24 px-gutter py-section"
    >
      <div className="grid grid-cols-12 gap-y-12 pt-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="font-display text-caption uppercase tracking-[0.3em] text-phosphor">
            02 — About
          </p>
          <OpenAboutButton className="group mt-6 inline-flex items-center gap-2 border border-phosphor/50 bg-phosphor/5 px-5 py-3 font-display text-caption uppercase tracking-[0.2em] text-phosphor transition-colors duration-300 hover:bg-phosphor hover:text-void">
            <span>&gt;_</span> Open full dossier
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </OpenAboutButton>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <h2 className="font-display text-h2 font-extrabold uppercase leading-[0.95] text-bone">
            <DecodeText text="DESIGN AS" trigger="view" speed={26} />
            <br />
            <DecodeText
              text="A LIVE SYSTEM"
              trigger="view"
              delay={160}
              speed={26}
              className="text-phosphor"
            />
          </h2>

          <div className="mt-10 max-w-prose space-y-6 text-lead text-bone-dim">
            {about.bio.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 0.08}>
                {p}
              </Reveal>
            ))}
          </div>

          {/* Services + tools — Swiss list, hairline rules. */}
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            <ul className="space-y-0">
              {services.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.k}
                  delay={i * 0.05}
                  className="flex items-baseline justify-between gap-4 border-t border-bone/10 py-4"
                >
                  <span className="font-display text-body font-bold text-bone">
                    <span className="mr-3 text-phosphor/60 text-caption">
                      {s.k}
                    </span>
                    {s.label}
                  </span>
                  <span className="text-right text-caption text-bone-faint">
                    {s.note}
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal className="border-t border-bone/10 py-4">
              <p className="mb-4 font-display text-micro uppercase tracking-[0.25em] text-phosphor/70">
                // Toolkit
              </p>
              <ul className="flex flex-wrap gap-2">
                {about.tools.map((t) => (
                  <li
                    key={t}
                    className="border border-bone/15 px-3 py-1.5 font-display text-caption text-bone-dim"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
