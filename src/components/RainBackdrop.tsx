"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy-load the canvas: it never blocks first paint or the JS critical path.
const DigitalRain = dynamic(() => import("./DigitalRain"), { ssr: false });

interface Props {
  opacity?: number;
  density?: number;
  interactive?: boolean;
  pauseOnModal?: boolean;
  className?: string;
  /** Delay mount until the browser is idle, keeping LCP clean. */
  defer?: boolean;
}

export default function RainBackdrop({
  defer = true,
  ...rest
}: Props) {
  const [ready, setReady] = useState(!defer);

  useEffect(() => {
    if (!defer) return;
    const idle =
      (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
    const id = idle
      ? idle(() => setReady(true), { timeout: 1200 })
      : window.setTimeout(() => setReady(true), 600);
    return () => {
      if (idle && typeof id === "number") {
        (
          window as unknown as {
            cancelIdleCallback?: (h: number) => void;
          }
        ).cancelIdleCallback?.(id);
      } else {
        window.clearTimeout(id as number);
      }
    };
  }, [defer]);

  if (!ready) return null;
  return <DigitalRain {...rest} />;
}
