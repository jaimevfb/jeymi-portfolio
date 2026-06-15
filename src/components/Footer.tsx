/**
 * Footer — a continuously scrolling "tape" ticker pinned to the very bottom.
 * Two identical sequences translate -50% for a seamless loop (CSS `marquee`
 * keyframe). Decorative duplicate is aria-hidden; freezes under reduced motion.
 */
const ITEMS = ["JEYMI", "2026", "PORTFOLIO", "BUILT IN THE VOID"];

function Sequence() {
  // Repeat the phrase a few times so one sequence spans wide screens.
  const cells = Array.from({ length: 4 }).flatMap(() => ITEMS);
  return (
    <div className="flex shrink-0 items-center">
      {cells.map((label, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              "font-display text-micro font-bold uppercase tracking-[0.25em] " +
              (label === "2026" ? "text-phosphor" : "text-bone-dim")
            }
          >
            {label}
          </span>
          <span className="mx-5 text-micro text-phosphor/55" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-void-50/80 py-2">
      {/* hairline glow top edge */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-phosphor/15"
        aria-hidden="true"
      />
      <div className="flex w-max animate-[marquee_38s_linear_infinite] whitespace-nowrap will-change-transform">
        <Sequence />
        <div aria-hidden="true" className="flex">
          <Sequence />
        </div>
      </div>
    </footer>
  );
}
