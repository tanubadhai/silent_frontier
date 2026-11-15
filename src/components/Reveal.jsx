import { motion, useReducedMotion } from "framer-motion";

const TAGS = { div: motion.div, li: motion.li, header: motion.header };

/**
 * Fade-and-rise when an element scrolls into view, played once.
 * Give items in a group an increasing `delay` (for example (index % 3) * 0.1) so they arrive in sequence.
 * Very tall blocks should pass a small `amount`, so the threshold is reachable on small screens.
 * With prefers-reduced-motion the content is shown immediately, with no movement.
 */
export default function Reveal({ as = "div", delay = 0, y = 28, amount = 0.2, children, ...props }) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as] ?? motion.div;

  if (reduce) {
    return <Tag {...props}>{children}</Tag>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Tag>
  );
}
