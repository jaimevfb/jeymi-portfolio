import { JetBrains_Mono, Inter } from "next/font/google";

/**
 * Two faces, no more.
 *  - JetBrains Mono → expressive terminal display face for headings + decode text.
 *  - Inter → clean grotesk for body, calm and highly legible on the void.
 * Loaded via next/font so they self-host, subset, and avoid layout shift.
 */
export const display = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
