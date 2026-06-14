"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { signals, bindPointer } from "@/lib/motion-signals";

/**
 * Wires Lenis smooth scroll into GSAP's ticker and ScrollTrigger so every
 * scroll-driven animation shares ONE timeline. Also publishes scroll velocity
 * to the shared signals for the rain to react to.
 *
 * Respects prefers-reduced-motion: Lenis is skipped entirely (native scroll).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    bindPointer();
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // No smoothing — let the OS scroll. Still refresh triggers on resize.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    document.documentElement.classList.add("lenis");

    lenis.on("scroll", (e: { velocity: number }) => {
      // Smooth the velocity a touch so the rain doesn't jitter.
      signals.scrollVelocity = e.velocity;
      ScrollTrigger.update();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Velocity decays toward 0 when scrolling stops.
    const decay = () => {
      signals.scrollVelocity *= 0.9;
    };
    const decayId = window.setInterval(decay, 100);

    return () => {
      gsap.ticker.remove(raf);
      window.clearInterval(decayId);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}
