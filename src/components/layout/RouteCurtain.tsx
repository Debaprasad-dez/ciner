import { motion } from 'framer-motion';

// Cinematic curtain wipe shown briefly on each route change. Mounted with a
// key tied to pathname inside AnimatePresence so it replays per navigation.
export default function RouteCurtain() {
  return (
    <motion.div
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      style={{ transformOrigin: 'top' }}
      className="pointer-events-none fixed inset-0 z-[65] bg-void"
    >
      <div className="flex h-full items-center justify-center">
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="font-display text-2xl italic text-text-muted"
        >
          ✦
        </motion.span>
      </div>
    </motion.div>
  );
}
