"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/site";

const BOOT = [
  "> initializing phosphor terminal",
  "> mounting glyph atlas … ok",
  "> calibrating rain density … ok",
  "> decrypting portfolio index … ok",
];

/**
 * One-time boot sequence. A short terminal log + progress, then the curtain
 * lifts to reveal the hero. Plays once per session; reduced-motion users get
 * an instant lift (no typing, ~0ms).
 */
export default function IntroLoader() {
  const [done, setDone] = useState(false);
  const [line, setLine] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("booted");

    if (reduced || seen) {
      setDone(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const lineTimer = window.setInterval(
      () => setLine((l) => Math.min(l + 1, BOOT.length)),
      300
    );
    const pctTimer = window.setInterval(
      () => setPct((p) => Math.min(p + 7, 100)),
      90
    );
    const finish = window.setTimeout(() => {
      sessionStorage.setItem("booted", "1");
      setDone(true);
      document.documentElement.style.overflow = "";
    }, 1700);

    return () => {
      window.clearInterval(lineTimer);
      window.clearInterval(pctTimer);
      window.clearTimeout(finish);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col justify-end bg-void px-gutter pb-[14vh]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <div className="mx-auto w-full max-w-shell">
            <div className="mb-8 font-display text-caption leading-relaxed text-phosphor/80">
              {BOOT.slice(0, line).map((b, i) => (
                <div key={i}>{b}</div>
              ))}
              <span className="animate-blink">█</span>
            </div>
            <div className="flex items-end justify-between gap-6">
              <span className="font-display text-mega font-extrabold leading-none text-bone">
                {site.name}
              </span>
              <span className="font-display text-h3 font-bold text-phosphor">
                {pct}%
              </span>
            </div>
            <div className="mt-6 h-px w-full bg-bone/10">
              <motion.div
                className="h-full bg-phosphor"
                animate={{ width: `${pct}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
