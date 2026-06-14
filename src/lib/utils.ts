/** Tiny classnames joiner — no clsx dependency needed for this surface. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation — used for cursor + rain easing. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
