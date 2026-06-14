/**
 * Site-wide identity + contact. Everything user-facing (meta, contact, footer,
 * hero) reads from here — change a value once and it updates everywhere.
 */
export const site = {
  name: "JEYMI",
  role: "Graphic Design Portfolio",
  email: "jaime.vfb@gmail.com",
  phone: "+639543671756",
  phoneDisplay: "+63 954 367 1756",
  url: "https://jeymi-portfolio.vercel.app",
  description:
    "Graphic design portfolio by Jeymi (Voss Jameson Bitong) — posters, motion graphics, visual identity, and UI/UX.",
  socials: [
    {
      label: "Instagram",
      handle: "@jamiee_vfb",
      href: "https://www.instagram.com/jamiee_vfb/",
    },
    {
      label: "Facebook",
      handle: "jamievfb",
      href: "https://www.facebook.com/jamievfb",
    },
    {
      label: "LinkedIn",
      handle: "in/voss-jameson",
      href: "https://www.linkedin.com/in/voss-jameson-bitong-4b734b3a5/",
    },
  ],
} as const;
