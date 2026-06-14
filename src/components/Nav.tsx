"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Live terminal clock — small ambient detail.
    const tick = () => {
      const d = new Date();
      setTime(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":")
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(id);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-bone/10 bg-void/70 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-shell items-center justify-between px-gutter py-4">
        <Link
          href="/"
          className="font-display text-base font-extrabold tracking-tight text-bone"
          aria-label={`${site.name} — home`}
        >
          <span className="text-phosphor">&gt;_</span> {site.name}
          <span className="animate-blink text-phosphor">█</span>
        </Link>

        <ul className="hidden items-center gap-8 font-display text-caption uppercase tracking-[0.18em] text-bone-dim md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group relative transition-colors duration-300 hover:text-phosphor"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-phosphor transition-all duration-300 ease-[var(--ease-terminal)] group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <span className="hidden font-display text-micro uppercase tracking-[0.2em] text-phosphor/70 sm:block">
          {time}
        </span>
      </nav>
    </header>
  );
}
