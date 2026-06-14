# BERNA — Phosphor Terminal Portfolio

An award-quality portfolio for poster design & motion graphics. A void-black,
phosphor-green "terminal" aesthetic: gallery-still layouts punctuated by a live
digital-rain backdrop and text that decodes itself from noise.

Built with **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS** ·
**GSAP/ScrollTrigger** · **Motion** (Framer Motion) · **Lenis** smooth scroll.
A custom **Canvas** code-rain is the signature — lazy-loaded, performance-capped,
and reactive to cursor + scroll velocity.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the build
node scripts/gen-placeholders.mjs   # (re)generate placeholder art
```

Requires Node 18.18+ (built/tested on Node 26).

---

## Adding a project

All work lives in **one typed file**: [`src/lib/projects.ts`](src/lib/projects.ts).
Append an object to the `projects` array:

```ts
{
  slug: "my-piece",              // unique → becomes /work/my-piece
  title: "My Piece",
  category: "Poster",            // "Poster" | "Motion" | "Identity"
  year: 2025,
  cover: "/work/my-piece.jpg",   // 3:4 image in /public/work
  video: "/work/my-piece.webm",  // OPTIONAL — looping muted .webm for Motion
  blurb: "One-line tagline for the grid.",
  description: "Full case-study copy for the detail page.",
  tags: ["Risograph", "Type"],
  accentColor: "#39FF6A",        // per-project glow/hover accent (hex)
  role: "Art Direction",         // optional
  client: "Self-initiated",      // optional
}
```

### Where assets go

| Asset            | Location          | Spec                                  |
| ---------------- | ----------------- | ------------------------------------- |
| Poster covers    | `/public/work/`   | **3:4**, jpg/png/webp (or svg)        |
| Motion loops     | `/public/work/`   | **muted .webm**, ~16:9, short loop    |
| Detail images    | `/public/work/`   | wire into `ProjectDetail` gallery     |
| OG card / favicon| `/public/`        | `og.svg` (1200×630), `favicon.svg`    |

Every placeholder is labelled `[REPLACE: …]` in the code and baked into the
generated SVGs. Search the repo for `[REPLACE` to find them all.

> **Note on images:** raster covers (jpg/png/webp) are optimized by `next/image`
> automatically. The placeholder **SVGs** are served unoptimized (see the
> `unoptimized={cover.endsWith(".svg")}` guard in `ProjectCard`/`ProjectDetail`).
> No config change needed when you swap in real raster art.

### Identity & contact

Name, role, email and socials live in [`src/lib/site.ts`](src/lib/site.ts).
Update the `[REPLACE]` values (email, domain, profile URLs) there.

---

## Tuning the digital rain

The rain is [`src/components/DigitalRain.tsx`](src/components/DigitalRain.tsx),
mounted via the lazy wrapper `RainBackdrop`. Per-instance props:

| Prop          | Default | Effect                                         |
| ------------- | ------- | ---------------------------------------------- |
| `opacity`     | `0.5`   | Layer opacity — **the legibility lever**.      |
| `density`     | `1`     | Column cadence / spawn rate.                   |
| `interactive` | `true`  | Columns brighten + accelerate near the cursor. |
| `defer`       | `true`  | Mount on `requestIdleCallback` (keeps LCP clean). |

Inside the component you can also tune:

- **Colors** — phosphor/amber/white literals in the `draw()` loop (or read from
  the CSS variables in [`globals.css`](src/app/globals.css)).
- **Glyph set** — `KATAKANA` / `SYMBOLS` constants (make them your own).
- **Cost cap** — `stepMs` (frame throttle, default ~36 fps), `dpr` cap (1.5),
  `fontSize` (column width). Lower fps / higher fontSize = cheaper.

Design tokens (palette, type scale, easings, durations) are centralized in
[`tailwind.config.ts`](tailwind.config.ts) and mirrored as CSS variables in
[`globals.css`](src/app/globals.css) so canvas + JS read one source of truth.

---

## Accessibility & motion

- **`prefers-reduced-motion`** is fully honored: rain collapses to a faint
  static field, decode text resolves instantly, the magnetic cursor stops
  lagging, and grain/scanlines freeze.
- Decode headings expose clean text via `aria-label`; animated glyphs are
  `aria-hidden`.
- Keyboard-navigable, skip-link, semantic landmarks, AA-minded contrast
  (off-white body copy; phosphor reserved for accents and large display).

---

## Structure

```
src/
  app/
    layout.tsx          # fonts, meta/OG, grain+scanlines, providers
    page.tsx            # Hero · Work · About · Contact
    template.tsx        # route-transition fade
    not-found.tsx       # 404 "signal lost"
    work/[slug]/page.tsx# SSG case-study pages
  components/           # Hero, WorkGrid, ProjectCard, DigitalRain, DecodeText, …
  lib/                  # projects.ts (content), site.ts, fonts, motion signals
scripts/
  gen-placeholders.mjs  # generates labelled placeholder art
```

---

## Deploy (Vercel)

Zero-config. Push to a Git repo and import in Vercel, or:

```bash
npx vercel --prod
```

No environment variables are required.

### Follow-ups for Berna

- Replace all `[REPLACE: …]` placeholders (posters, motion `.webm`, bio, awards).
- Set real `email`, `url`, and social links in `src/lib/site.ts`.
- Drop a real `og.svg`/PNG and `favicon.svg` in `/public`.
- Optional: wire a custom domain in Vercel; add real detail-page gallery images.
```
