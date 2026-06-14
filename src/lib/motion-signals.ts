/**
 * Shared, mutable motion signals — written by Lenis + pointer listeners,
 * read every frame by the canvas rain and the magnetic cursor.
 *
 * Deliberately NOT React state: these update at 60fps and must never trigger
 * re-renders. One module-level object, read by rAF loops.
 */
export const signals = {
  /** Pointer position, normalized 0..1 across the viewport. */
  pointerX: 0.5,
  pointerY: 0.5,
  /** Raw pointer pixels (for the magnetic cursor). */
  pointerPxX: 0,
  pointerPxY: 0,
  /** Whether the pointer is a fine pointer (mouse) and currently active. */
  pointerActive: false,
  /** Smoothed scroll velocity (px/frame-ish), written by Lenis. */
  scrollVelocity: 0,
  /** Whether the user has requested reduced motion. */
  reducedMotion: false,
};

let bound = false;

/** Attach global pointer listeners exactly once (client only). */
export function bindPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;

  const onMove = (e: PointerEvent) => {
    signals.pointerPxX = e.clientX;
    signals.pointerPxY = e.clientY;
    signals.pointerX = e.clientX / window.innerWidth;
    signals.pointerY = e.clientY / window.innerHeight;
    signals.pointerActive = e.pointerType === "mouse";
  };
  const onLeave = () => {
    signals.pointerActive = false;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerout", onLeave, { passive: true });

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  signals.reducedMotion = mq.matches;
  mq.addEventListener("change", (ev) => {
    signals.reducedMotion = ev.matches;
  });
}
