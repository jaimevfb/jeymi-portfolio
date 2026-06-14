import type { Config } from "tailwindcss";

/**
 * Phosphor Terminal design system.
 * Color/space/type tokens are mirrored as CSS variables in globals.css so that
 * canvas (digital rain) and JS animations can read the exact same palette.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Hard reset of the default scale — we want a deliberate, narrow palette,
    // not Tailwind's 22-step rainbow. No default blue anywhere.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Void canvas
      void: {
        DEFAULT: "#070A07", // near-black with a green undertone
        50: "#0A0E0A",
        100: "#0E140E",
        200: "#141B14",
        300: "#1B241B",
      },
      // Phosphor green — the electric primary
      phosphor: {
        DEFAULT: "#39FF6A",
        dim: "#2BC053",
        deep: "#137A30",
        glow: "#7CFFA0",
      },
      // Off-white — the readable body ink
      bone: {
        DEFAULT: "#E8EDE6",
        dim: "#A6AEA3",
        faint: "#5E665C",
      },
      // Restrained secondary accent — terminal-warning amber
      amber: {
        DEFAULT: "#FFB23E",
        dim: "#C8841F",
      },
    },
    fontFamily: {
      display: ["var(--font-display)", "ui-monospace", "monospace"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
    },
    // Fluid type scale (clamp) — oversized display, calm body.
    fontSize: {
      micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],
      caption: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.04em" }],
      body: ["1rem", { lineHeight: "1.7" }],
      lead: ["clamp(1.125rem, 1.6vw, 1.375rem)", { lineHeight: "1.6" }],
      h3: ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      h2: ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      h1: ["clamp(2.75rem, 9vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
      mega: ["clamp(3.5rem, 16vw, 13rem)", { lineHeight: "0.86", letterSpacing: "-0.04em" }],
    },
    extend: {
      spacing: {
        gutter: "var(--gutter)",
        section: "clamp(6rem, 14vh, 12rem)",
      },
      maxWidth: {
        shell: "1600px",
        prose: "62ch",
      },
      transitionTimingFunction: {
        // Signature easings — read by both CSS and GSAP.
        terminal: "cubic-bezier(0.16, 1, 0.3, 1)", // soft, confident settle
        snap: "cubic-bezier(0.7, 0, 0.2, 1)",
        glide: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      transitionDuration: {
        deliberate: "720ms",
      },
      keyframes: {
        "grain-shift": {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-4%,-4%)" },
          "30%": { transform: "translate(3%,-2%)" },
          "50%": { transform: "translate(-2%,3%)" },
          "70%": { transform: "translate(4%,2%)" },
          "90%": { transform: "translate(-3%,1%)" },
        },
        "scan-drift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 -100vh" },
        },
        "cursor-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        // Seamless side-to-side poster slideshow. Track holds 2 identical
        // copies; shifting by -50% loops with no visible seam.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        grain: "grain-shift 1.2s steps(6) infinite",
        scan: "scan-drift 14s linear infinite",
        blink: "cursor-blink 1.1s steps(1) infinite",
        marquee: "marquee 46s linear infinite",
        "marquee-rev": "marquee-rev 58s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
