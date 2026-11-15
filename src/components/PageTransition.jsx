import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

/**
 * Wraps a routed page in a short fade. Under prefers-reduced-motion the
 * slide is removed and only the fade remains (see MotionConfig in App.jsx).
 */
export default function PageTransition({ children }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
