/**
 * Generates labelled placeholder assets so the site is visually complete
 * before Berna's real work lands. Re-run with: node scripts/gen-placeholders.mjs
 *
 * Every poster is a 3:4 SVG carrying a clear [REPLACE] label. Swap the files
 * in /public/work/ for real images (keep the filename or update projects.ts).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const workDir = join(root, "public", "work");
mkdirSync(workDir, { recursive: true });

const VOID = "#070A07";
const PHOS = "#39FF6A";
const AMBER = "#FFB23E";
const BONE = "#E8EDE6";

const posters = [
  { file: "signal-decay", title: "SIGNAL DECAY", accent: PHOS, n: "01" },
  { file: "null-state", title: "NULL STATE", accent: AMBER, n: "02" },
  { file: "ghost-protocol", title: "GHOST PROTOCOL", accent: "#7CFFA0", n: "03" },
  { file: "half-life-grid", title: "HALF-LIFE GRID", accent: PHOS, n: "04" },
  { file: "rainfall", title: "RAINFALL", accent: AMBER, n: "05" },
  { file: "monospace-manifesto", title: "MONOSPACE", accent: "#7CFFA0", n: "06" },
];

function poster({ title, accent, n }) {
  // Procedural glyph grid backdrop for texture.
  // NOTE: XML-safe glyphs only — no <, >, & (they'd break SVG parsing).
  const glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽ0123456789";
  let field = "";
  let seed = title.length * 7 + 13;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let y = 0; y < 24; y++) {
    for (let x = 0; x < 18; x++) {
      if (rand() > 0.82) {
        const g = glyphs[(rand() * glyphs.length) | 0];
        field += `<text x="${24 + x * 30}" y="${40 + y * 32}" fill="${accent}" fill-opacity="${
          0.06 + rand() * 0.12
        }" font-family="monospace" font-size="20">${g}</text>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="${VOID}"/>
  ${field}
  <rect x="24" y="24" width="552" height="752" fill="none" stroke="${accent}" stroke-opacity="0.4"/>
  <line x1="24" y1="120" x2="576" y2="120" stroke="${accent}" stroke-opacity="0.25"/>
  <text x="44" y="80" fill="${accent}" font-family="monospace" font-size="22" letter-spacing="4">${n} / WORK</text>
  <text x="44" y="430" fill="${BONE}" font-family="monospace" font-weight="800" font-size="58" letter-spacing="-1">${title}</text>
  <text x="44" y="470" fill="${accent}" font-family="monospace" font-size="18" letter-spacing="2">[REPLACE: poster image 3:4]</text>
  <text x="44" y="752" fill="${BONE}" fill-opacity="0.5" font-family="monospace" font-size="15">PLACEHOLDER · drop real artwork in /public/work</text>
</svg>`;
}

for (const p of posters) {
  writeFileSync(join(workDir, `${p.file}.svg`), poster(p));
}

// Favicon — phosphor caret on void.
writeFileSync(
  join(root, "public", "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${VOID}"/><text x="14" y="46" fill="${PHOS}" font-family="monospace" font-weight="800" font-size="40">&gt;_</text></svg>`
);

// OG image — 1200x630 social card.
writeFileSync(
  join(root, "public", "og.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${VOID}"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${PHOS}" stroke-opacity="0.3"/>
  <text x="80" y="160" fill="${PHOS}" font-family="monospace" font-size="28" letter-spacing="8">&gt;_ PORTFOLIO</text>
  <text x="80" y="340" fill="${BONE}" font-family="monospace" font-weight="800" font-size="120" letter-spacing="-4">BERNA</text>
  <text x="80" y="410" fill="${BONE}" fill-opacity="0.7" font-family="monospace" font-size="34">Poster Design &amp; Motion Graphics</text>
  <text x="80" y="560" fill="${AMBER}" font-family="monospace" font-size="22">DECODING…</text>
</svg>`
);

console.log("Placeholders generated → /public/work, /public/favicon.svg, /public/og.svg");
