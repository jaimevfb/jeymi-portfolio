"use client";

import { motion } from "motion/react";

/**
 * Route-transition wrapper. template.tsx re-mounts on every navigation, so a
 * mount-time fade/clip gives smooth page transitions across the whole app
 * without the fragility of the experimental View Transitions flag.
 * Reduced-motion users get a near-instant fade (transform is minimal).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
