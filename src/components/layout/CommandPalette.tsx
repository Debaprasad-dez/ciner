import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import { useSearch } from '@/hooks/useTMDB';
import { posterUrl } from '@/services/tmdb';
import { yearOf } from '@/utils/formatters';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Discover by mood', to: '/discover' },
  { label: 'Movie Galaxy', to: '/galaxy' },
  { label: 'Profile', to: '/profile' },
];

export default function CommandPalette() {
  const { paletteOpen, setPalette, shortcutsOpen, setShortcuts } = useUIStore();
  const [query, setQuery] = useState('');
  const { data } = useSearch(query);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'k') {
        e.preventDefault();
        setPalette(!paletteOpen);
      } else if (meta && e.key === 'g') {
        e.preventDefault();
        navigate('/galaxy');
      } else if (meta && e.key === 'd') {
        e.preventDefault();
        navigate('/discover');
      } else if (meta && e.key === '/') {
        e.preventDefault();
        setShortcuts(!shortcutsOpen);
      } else if (e.key === 'Escape') {
        setPalette(false);
        setShortcuts(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, shortcutsOpen, navigate, setPalette, setShortcuts]);

  const go = (to: string) => {
    navigate(to);
    setPalette(false);
    setQuery('');
  };

  return (
    <>
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPalette(false)}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-void/70 pt-[12vh] backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-xl overflow-hidden"
            >
              <input
                autoFocus
                data-hoverable
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search films or jump to…"
                className="w-full bg-transparent px-5 py-4 font-ui text-lg outline-none placeholder:text-text-muted"
              />
              <div className="max-h-[50vh] overflow-y-auto border-t border-glass">
                {query.length <= 1
                  ? NAV.map((n) => (
                      <button
                        key={n.to}
                        data-hoverable
                        onClick={() => go(n.to)}
                        className="block w-full px-5 py-3 text-left font-ui text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                      >
                        {n.label}
                      </button>
                    ))
                  : data?.slice(0, 8).map((m) => (
                      <button
                        key={m.id}
                        data-hoverable
                        onClick={() => go(`/movie/${m.id}`)}
                        className="flex w-full items-center gap-3 px-5 py-2 text-left hover:bg-surface-2"
                      >
                        {m.poster_path && (
                          <img src={posterUrl(m.poster_path, 'w342')} alt="" className="h-12 w-8 rounded object-cover" />
                        )}
                        <span className="font-ui text-sm text-text-primary">{m.title}</span>
                        <span className="ml-auto font-mono text-xs text-text-muted">{yearOf(m.release_date)}</span>
                      </button>
                    ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shortcutsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShortcuts(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-void/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-80 p-6"
            >
              <h3 className="mb-4 font-display text-xl italic">Shortcuts</h3>
              {[
                ['⌘ K', 'Search'],
                ['⌘ G', 'Galaxy'],
                ['⌘ D', 'Discover'],
                ['⌘ /', 'This menu'],
                ['Esc', 'Close'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-1.5 font-ui text-sm">
                  <span className="text-text-secondary">{v}</span>
                  <kbd className="rounded bg-surface-2 px-2 py-1 font-mono text-xs">{k}</kbd>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
