/**
 * ─────────────────────────────────────────────────────────────
 * CONTENT MODEL — the single source of truth for all work.
 *
 * To add a project: append an object to the `projects` array below.
 *  • cover  → drop the artwork in /public/work/
 *  • video  → optional looping muted .webm for Motion pieces
 *  • accentColor → per-project glow/hover accent (hex)
 *
 * `slug` must be unique (it becomes the /work/[slug] URL).
 * ─────────────────────────────────────────────────────────────
 */

export type Category = "Poster" | "Motion" | "Identity";

export interface Project {
  slug: string;
  title: string;
  category: Category;
  year: number;
  /** Poster artwork, path under /public. */
  cover: string;
  /** Optional looping muted .webm for Motion pieces. */
  video?: string;
  /** One-line tagline shown in the showcase + lightbox. */
  blurb: string;
  /** Full case-study description. */
  description: string;
  tags: string[];
  /** Per-project accent (hex), pulled from each poster's palette. */
  accentColor: string;
  role?: string;
  client?: string;
}

// Real event key art for Parallel Dimensions, Manila — 2025 season.
export const projects: Project[] = [
  {
    slug: "fever-dream",
    title: "Fever Dream",
    category: "Poster",
    year: 2025,
    cover: "/work/fever-dream.jpg",
    blurb: "Analog-fever key art that sells the feeling before the night begins.",
    description:
      "Headline visual for Fever Dream at Atmosfera. A worn cassette suspended in static, type hand-sprayed to the edge of legibility — built to make a club night feel like a memory you already have. Mood as marketing.",
    tags: ["Key Art", "Analog", "Type"],
    accentColor: "#A98C97",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "fever-dream-beats",
    title: "Fever Dream — Beats",
    category: "Poster",
    year: 2025,
    cover: "/work/fever-dream-beats.jpg",
    blurb: "A lineup card engineered for the repost.",
    description:
      "Companion announce for Fever Dream — a taped polaroid, scrawled names, a parental-advisory wink. Lo-fi on purpose: promo collateral with enough texture that the audience wants to share it themselves.",
    tags: ["Lineup", "Promo", "Social"],
    accentColor: "#FF6A1F",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "after-dark",
    title: "After Dark",
    category: "Poster",
    year: 2025,
    cover: "/work/after-dark.jpg",
    blurb: "A surreal theatre visual that stops the scroll and fills the room.",
    description:
      "Headline key art for After Dark at Roof Manila — a bleached, taped flyer of clock-faces, watching eyes and an endless crowd, staged inside a gilded theatre frame. Cinematic intrigue with one job: turn curiosity into a sellout.",
    tags: ["Key Art", "Collage", "Editorial"],
    accentColor: "#A0282F",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "after-dark-floorplan",
    title: "After Dark — Floorplan",
    category: "Poster",
    year: 2025,
    cover: "/work/after-dark-floorplan.jpg",
    blurb: "Logistics, designed so well they feel like part of the show.",
    description:
      "Table map and bottle packages for After Dark, rendered as a photocopied artifact so even the seating chart stays in character. Information design that sells tables without breaking the spell.",
    tags: ["Information Design", "Layout", "Collateral"],
    accentColor: "#E0A53A",
    role: "Design · Layout",
    client: "Parallel Dimensions",
  },
  {
    slug: "dia",
    title: "Día",
    category: "Poster",
    year: 2025,
    cover: "/work/dia.jpg",
    blurb: "An All-Souls visual that carves a lineup into legend.",
    description:
      "Key art for an All-Souls-season night at Dean & Deluca, BGC — the bill engraved into ornate granite, ringed by candlelight. Reverent, theatrical and impossible to scroll past: a flyer that behaves like a monument.",
    tags: ["Key Art", "Type", "Seasonal"],
    accentColor: "#9AA0A6",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "dia-tickets",
    title: "Día — Tickets",
    category: "Poster",
    year: 2025,
    cover: "/work/dia-tickets.jpg",
    blurb: "Ticket tiers set like a vintage postage stamp.",
    description:
      "Pricing collateral for Día at Dean & Deluca (with Ploom & Pica Pica) — phased tiers (Early Bird → Walk-ins) engraved on a perforated stamp in dueling script and grotesk. Old-world stationery meets the rave.",
    tags: ["Ticketing", "Type", "Collateral"],
    accentColor: "#9AA0A6",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "dia-floorplan",
    title: "Día — Floorplan",
    category: "Poster",
    year: 2025,
    cover: "/work/dia-floorplan.jpg",
    blurb: "A table map that doubles as part of the set design.",
    description:
      "Venue information design for Día at Dean & Deluca — tables, packages and flow rendered as a creased, gloved-hand artifact so the seating plan still reads as the night itself. Function, fully in-world.",
    tags: ["Information Design", "Layout", "Collateral"],
    accentColor: "#B81E2D",
    role: "Design · Layout",
    client: "Parallel Dimensions",
  },
  {
    slug: "paranormal-stories",
    title: "Paranormal Stories",
    category: "Poster",
    year: 2025,
    cover: "/work/paranormal-stories.jpg",
    blurb: "A campaign hook that makes the audience part of the show.",
    description:
      "Call-for-submissions story for the Halloween podcast — a blood-flecked case file inviting the crowd to hand over their own ghost stories. Engagement design disguised as a crime scene; community as content.",
    tags: ["Campaign", "Social", "Seasonal"],
    accentColor: "#B11212",
    role: "Concept · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "autopsy-tickets",
    title: "Autopsy — Tickets",
    category: "Poster",
    year: 2025,
    cover: "/work/ld-tickets.jpg",
    blurb: "Ticket tiers staged as a blood-spattered coroner's report.",
    description:
      "Pricing collateral for the October 25 night at Metwo, Makati — prices hand-painted in dripping red across a decedent's case file and body diagram. Grimy, cinematic, unmistakably a party you'd remember.",
    tags: ["Ticketing", "Horror", "Collateral"],
    accentColor: "#8E2230",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "wake-dm",
    title: "Wake DM",
    category: "Poster",
    year: 2025,
    cover: "/work/wake-dm.jpg",
    blurb: "Blackletter-and-blood key art that turns a night into a ritual.",
    description:
      "Headline visual for the Mckinley Whisky Park night (Charles & James) — ornate playing cards on cracked stone, blackletter title, a whisper of blood. Maximalist mood held together by surgical restraint.",
    tags: ["Key Art", "Blackletter", "Concept"],
    accentColor: "#8E1B1B",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "dead-mans-hand",
    title: "Wake DM — Cards",
    category: "Poster",
    year: 2025,
    cover: "/work/dead-mans-hand.jpg",
    blurb: "A lineup dealt like a hand — every artist a face card.",
    description:
      "Companion announce for the Mckinley night — each DJ illustrated as a turntablist court figure on a blood-stained card. Concept-first promo that earns the screenshot and remembers the brand.",
    tags: ["Illustration", "Lineup", "Concept"],
    accentColor: "#8E1B1B",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "cyber-ritual",
    title: "Cyber: Ritual",
    category: "Poster",
    year: 2025,
    cover: "/work/cyber-ritual.jpg",
    blurb: "Future-gothic key art that reads expensive and dangerous.",
    description:
      "Headline visual for Cyber: Ritual at Salty Coconut — a chrome vampire grill, a gothic cross, liquid-metal chains. Y2K cyber-sigilism rendered with intent: an identity that looks like it costs more than the cover.",
    tags: ["Key Art", "Chrome", "Type"],
    accentColor: "#9FBAC6",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "cyber-ritual-beats",
    title: "Cyber: Ritual — Beats",
    category: "Poster",
    year: 2025,
    cover: "/work/cyber-ritual-beats.jpg",
    blurb: "A lineup pressed into vinyl — where the format is the message.",
    description:
      "Companion announce for Cyber: Ritual — names set in orbit around a saw-blade record, bubble-script colliding with chrome. The medium does the talking before a single name is read.",
    tags: ["Lineup", "Vinyl", "Promo"],
    accentColor: "#C7CCD2",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "cyber-ritual-tickets",
    title: "Cyber: Ritual — Tickets",
    category: "Poster",
    year: 2025,
    cover: "/work/cyber-ritual-tickets.jpg",
    blurb: "Pricing turned into something worth collecting.",
    description:
      "Ticket-tier collateral for Cyber: Ritual — perforated teal stubs scattered across the chrome artwork. Proof that even a price list can hold the line on art direction.",
    tags: ["Ticketing", "Type", "Collateral"],
    accentColor: "#5C8190",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
  {
    slug: "third-anniversary",
    title: "3rd Anniversary",
    category: "Poster",
    year: 2025,
    cover: "/work/third-anniversary.jpg",
    blurb: "Cast-metal type that gives a milestone real weight.",
    description:
      "Ticket-pricing key art for the Parallel Dimensions 3rd Anniversary — gothic type embossed into chained metal plates. Heavy, deliberate, ceremonial: a milestone you can feel before you read it.",
    tags: ["Key Art", "3D Type", "Collateral"],
    accentColor: "#B8BCC2",
    role: "Art Direction · Design",
    client: "Parallel Dimensions",
  },
];

export const categories: Array<Category | "All"> = [
  "All",
  "Poster",
  "Motion",
  "Identity",
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string): {
  prev: Project;
  next: Project;
} {
  const i = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return { prev, next };
}
