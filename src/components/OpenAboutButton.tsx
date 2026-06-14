"use client";

import { openAbout } from "./AboutOverlay";

/** Client trigger that opens the About Me dossier overlay. */
export default function OpenAboutButton({
  className = "",
  children = "About Me",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openAbout} className={className}>
      {children}
    </button>
  );
}
