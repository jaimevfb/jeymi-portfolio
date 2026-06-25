import type { Metadata, Viewport } from "next";
import { display, sans } from "@/lib/fonts";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import MagneticCursor from "@/components/MagneticCursor";
import RainBackdrop from "@/components/RainBackdrop";
import AboutOverlay from "@/components/AboutOverlay";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Jeymi Portfolio 2026",
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "poster design",
    "motion graphics",
    "graphic design",
    "kinetic typography",
    "portfolio",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    title: "Jeymi Portfolio 2026",
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeymi Portfolio 2026",
    description: site.description,
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#070A07",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        {/* Skip link for keyboard users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-void-100 focus:px-4 focus:py-2 focus:text-phosphor focus:outline focus:outline-1 focus:outline-phosphor"
        >
          Skip to content
        </a>

        {/* Global digital rain — one fixed canvas behind ALL content, so the
            code-rain spans the entire page (not just the hero). */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          aria-hidden="true"
        >
          <RainBackdrop opacity={0.4} density={1} pauseOnModal />
        </div>

        {/* Scroll progress. */}
        <ScrollProgress />

        <SmoothScroll>{children}</SmoothScroll>

        {/* Atmosphere layers — non-interactive, above content, below cursor. */}
        <div className="grain-layer animate-grain" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <MagneticCursor />

        {/* "About Me" dossier — opens on the global open-about event. */}
        <AboutOverlay />
      </body>
    </html>
  );
}
