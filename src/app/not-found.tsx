import Link from "next/link";
import type { Metadata } from "next";
import DecodeText from "@/components/DecodeText";

export const metadata: Metadata = { title: "404 — Signal Lost" };

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-gutter text-center"
    >
      <div className="relative z-10">
        <p className="font-display text-caption uppercase tracking-[0.3em] text-amber">
          // error 0x194 — signal lost
        </p>
        <h1 className="mt-6 font-display text-mega font-extrabold leading-none text-bone glow-phosphor">
          <DecodeText text="404" speed={70} />
        </h1>
        <p className="mx-auto mt-6 max-w-prose text-lead text-bone-dim">
          This frame decoded to noise. The page you&apos;re after has drifted
          out of the signal.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-3 border border-phosphor/60 bg-phosphor/5 px-7 py-3.5 font-display text-caption uppercase tracking-[0.2em] text-phosphor transition-colors duration-300 hover:bg-phosphor hover:text-void"
        >
          <span className="text-current">&gt;_</span> Return to signal
        </Link>
      </div>
    </main>
  );
}
