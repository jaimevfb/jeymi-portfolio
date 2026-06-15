"use client";

import { motion } from "motion/react";

/**
 * Route-transition wrapper. Opacity-only on purpose: a `filter`/`transform`
 * here would create a containing block for descendant `position: fixed`
 * elements (modals/lightbox would anchor to this wrapper instead of the
 * viewport). A clean fade keeps transitions smooth without that side effect.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
