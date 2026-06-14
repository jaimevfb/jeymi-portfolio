"use client";

import { useEffect, useRef } from "react";
import { signals } from "@/lib/motion-signals";
import { clamp } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────
 * DIGITAL RAIN — the signature backdrop.
 *
 * Original execution (no film assets): a custom glyph set built from
 * half-width katakana + bespoke symbols. Columns of glyphs drift downward;
 * a bright phosphor "head" leads a fading trail.
 *
 * Reactivity (subtle by design — ambient, never distracting):
 *   • cursor  → columns near the pointer brighten + accelerate slightly
 *   • scroll  → global fall speed + spawn rate scale with scroll velocity
 *
 * Performance discipline:
 *   • devicePixelRatio capped at 1.5
 *   • simulation throttled to ~36fps (ambient motion needs no more)
 *   • pauses when off-screen (IntersectionObserver) or tab hidden
 *   • column count derived from width → bounded work per frame
 *
 * Accessibility: prefers-reduced-motion renders a faint STATIC field and
 * never starts the animation loop.
 * ─────────────────────────────────────────────────────────────
 */

// Bespoke glyph set — katakana-ish, digits, and custom terminal symbols.
const KATAKANA = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const SYMBOLS = "01<>/\\=+*¦│┤┼※∴∷⋮⌁⌇▟▙◹◸";
const GLYPHS = (KATAKANA + SYMBOLS + "0123456789").split("");

function pickGlyph(): string {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

interface Props {
  /** Overall opacity of the canvas layer (content legibility lever). */
  opacity?: number;
  /** Column density multiplier (1 = default cadence). */
  density?: number;
  /** Whether columns react to the cursor. */
  interactive?: boolean;
  /** Pause drawing while a modal is open (html.modal-open) — saves CPU when
   *  this layer is occluded by an overlay that has its own rain. */
  pauseOnModal?: boolean;
  className?: string;
}

export default function DigitalRain({
  opacity = 0.5,
  density = 1,
  interactive = true,
  pauseOnModal = false,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Device-aware budget: phones / coarse-pointer / low-core machines get a
    // cheaper canvas (lower DPR, bigger glyphs = fewer columns, lower FPS).
    const isMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
    const fontSize = isMobile ? 22 : 16;
    let columns = 0;
    let drops: number[] = []; // head row index per column
    let speeds: number[] = []; // per-column fall speed (rows/step)
    let width = 0;
    let height = 0;

    const setup = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${fontSize}px var(--font-display), ui-monospace, monospace`;
      ctx.textBaseline = "top";

      columns = Math.ceil(width / fontSize);
      drops = new Array(columns)
        .fill(0)
        .map(() => Math.floor((Math.random() * -height) / fontSize));
      speeds = new Array(columns)
        .fill(0)
        .map(() => 0.4 + Math.random() * 0.7);
    };

    // ── Reduced motion: paint a single faint static field, then stop. ──
    const paintStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(57,255,106,0.10)";
      for (let x = 0; x < columns; x++) {
        const rows = Math.floor(height / fontSize);
        for (let y = 0; y < rows; y += 3) {
          if (Math.random() > 0.86) {
            ctx.fillText(pickGlyph(), x * fontSize, y * fontSize);
          }
        }
      }
    };

    let raf = 0;
    let running = true;
    let visible = true;
    let last = 0;
    const stepMs = 1000 / (isMobile || lowPower ? 24 : 36); // throttle FPS

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!running || !visible) return;
      if (
        pauseOnModal &&
        document.documentElement.classList.contains("modal-open")
      )
        return;
      if (now - last < stepMs) return;
      last = now;

      // Scroll velocity → global speed/spawn boost (clamped, ambient).
      const vel = clamp(Math.abs(signals.scrollVelocity) / 40, 0, 1.6);
      const speedBoost = 1 + vel * 1.4;
      const spawnBoost = 1 + vel * 0.5;

      // Trailing fade — translucent void wash creates the comet tails.
      ctx.fillStyle = "rgba(7,10,7,0.14)";
      ctx.fillRect(0, 0, width, height);

      // Pointer in CSS px — the global layer is fixed full-viewport, so
      // client coords map 1:1 to the canvas drawing space.
      const ppx = signals.pointerPxX;
      const ppy = signals.pointerPxY;
      const pointerOn = interactive && signals.pointerActive;
      const R = 190; // disturbance radius

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // 2D cursor disturbance: glyphs near the pointer light up and rush;
        // the very center clears, so the cursor "parts" the stream.
        let nearBoost = 0;
        let clear = 0;
        if (pointerOn) {
          const dx = x - ppx;
          const dy = y - ppy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < R) {
            nearBoost = 1 - dist / R; // 0 at edge → 1 at center
            if (dist < 72) clear = (1 - dist / 72) * 0.85; // clearing core
          }
        }

        if (y > 0) {
          // Head glyph — brightens toward white near the pointer, fades in
          // the clearing core.
          const headA = (0.82 + nearBoost * 0.18) * (1 - clear);
          const roll = Math.random();
          if (roll > 0.985 || nearBoost > 0.55)
            ctx.fillStyle = `rgba(255,255,255,${headA})`;
          else if (roll > 0.95) ctx.fillStyle = `rgba(255,178,62,${headA})`;
          else ctx.fillStyle = `rgba(124,255,160,${headA})`;
          ctx.fillText(pickGlyph(), x, y);

          // One dim trailing glyph for body.
          ctx.fillStyle = `rgba(43,192,83,${(0.28 + nearBoost * 0.5) * (1 - clear)})`;
          ctx.fillText(pickGlyph(), x, y - fontSize);
        }

        // Advance head; columns near the pointer surge faster.
        drops[i] +=
          speeds[i] * speedBoost * density * (1 + nearBoost * 1.1);
        if (
          y > height &&
          Math.random() > 0.975 / (spawnBoost * density)
        ) {
          drops[i] = Math.floor((Math.random() * -20) - 2);
          speeds[i] = 0.4 + Math.random() * 0.7;
        }
      }
    };

    setup();

    if (reduced) {
      paintStatic();
      const onResizeStatic = () => {
        setup();
        paintStatic();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    // Pause when scrolled off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // Pause when tab hidden.
    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeT: number;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(setup, 150);
    };
    window.addEventListener("resize", onResize);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeT);
    };
  }, [density, interactive, pauseOnModal]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
