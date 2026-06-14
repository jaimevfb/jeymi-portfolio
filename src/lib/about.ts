/**
 * "About Me" dossier content. Everything in the About Me overlay reads from
 * here — edit these values (all marked [REPLACE]) and the panel updates.
 */
export const about = {
  // Real identity.
  fullName: "Voss Jameson Bitong",
  title: "Creative Graphic Designer & UI/UX Designer",
  birthday: "March 26, 2007",

  tagline: "I turn briefs into worlds — posters, motion, and interfaces with a pulse.",

  // Portrait shown in the dossier side rail (4:5-ish crop). Swap the file in
  // /public to change it; set to "" to fall back to the placeholder box.
  portrait: "/jeymi-portrait.jpg",

  bio: [
    "I'm Jeymi — a creative designer working where graphic design, motion, and UI meet. Every brief is a world to build: I tune composition, rhythm, and tension until the work stops being looked at and starts being felt.",
    "From event identities to interfaces, I make work that earns attention and keeps it — concept-first, craft-obsessed, and aimed squarely at the people it's made for. Heading into 2026, I'm chasing the briefs that scare me a little.",
  ],

  // Quick facts shown in the side rail.
  facts: [
    { label: "Based in", value: "Manila, Philippines" },
    { label: "Birthday", value: "March 26, 2007" },
    { label: "Focus", value: "Poster · Motion · Identity" },
    { label: "Status", value: "Open for 2026 opportunities" },
  ],

  // What you do.
  disciplines: [
    "Poster & Key Art",
    "Motion Graphics",
    "Visual Identity",
    "UI/UX Design",
  ],

  tools: [
    "Figma",
    "Canva",
    "Photoshop",
    "Lightroom",
    "Illustrator",
    "After Effects",
    "TouchDesigner",
    "InDesign",
    "Blender",
  ],

  // Experience timeline.
  experience: [
    {
      role: "Core Team",
      org: "Cursor PH",
      period: "Oct 2025 — Present",
    },
    {
      role: "Graphic Designer",
      org: "Freelance",
      period: "Mar 2025 — Present",
    },
    {
      role: "Creative Associate",
      org: "Parallel Dimensions",
      period: "Jun 2025 — Feb 2026",
    },
  ],

  // Education / training.
  education: [
    {
      program: "BS Computer Science",
      school: "Pamantasan ng Lungsod ng Maynila",
      period: "2025 — Present",
    },
  ],
} as const;
