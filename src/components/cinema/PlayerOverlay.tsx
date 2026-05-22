import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { useMovie } from '@/hooks/useTMDB';
import VidkingPlayer from './VidkingPlayer';

// Single global player overlay. Any movie card / button opens it via uiStore.playMovie.
export default function PlayerOverlay() {
  const playerMovie = useUIStore((s) => s.playerMovie);
  const closePlayer = useUIStore((s) => s.closePlayer);

  return (
    <AnimatePresence>
      {playerMovie && <Inner id={playerMovie.id} onClose={closePlayer} />}
    </AnimatePresence>
  );
}

function Inner({ id, onClose }: { id: number; onClose: () => void }) {
  const { data: movie } = useMovie(id);
  const { toggleWatched, isWatched } = useUserStore();
  const stageRef = useRef<HTMLDivElement>(null);

  const accent =
    getComputedStyle(document.documentElement).getPropertyValue('--accent-crimson').trim().replace('#', '') || 'e8624a';

  // Request native fullscreen on the player stage when it opens; exit closes the player.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.requestFullscreen?.().catch(() => {});
    const onFsChange = () => {
      if (!document.fullscreenElement) onClose();
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-void p-4 md:p-10"
    >
      <div ref={stageRef} className="relative flex w-full max-w-6xl items-center bg-void" onClick={(e) => e.stopPropagation()}>
        <button
          data-hoverable
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-void/70 px-3 py-1.5 font-ui text-sm text-text-primary backdrop-blur-sm hover:bg-surface-2"
        >
          ✕
        </button>
        <VidkingPlayer
          tmdbId={id}
          color={accent}
          autoPlay
          className="rounded-none"
          onProgress={(p) => {
            if (p.progress >= 90 && movie && !isWatched(id)) toggleWatched(movie);
          }}
        />
      </div>
    </motion.div>
  );
}
