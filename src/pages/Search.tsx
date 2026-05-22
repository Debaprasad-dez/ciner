import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useTMDB';
import MovieCard, { MovieCardSkeleton } from '@/components/cinema/MovieCard';
import PageTransition from '@/components/layout/PageTransition';
import { useUIStore } from '@/stores/uiStore';

const PLACEHOLDERS = [
  'Movies where villains find redemption…',
  'Slow philosophical films with rain atmosphere…',
  'Anime with emotional depth and stunning visuals…',
  'Heist films with a melancholy streak…',
];

const SUGGESTIONS = [
  'Mind-bending sci-fi',
  'Cozy comfort films',
  'A24 slow burns',
  'Neo-noir thrillers',
  'Studio Ghibli magic',
  'One-shot war epics',
];

interface Action {
  icon: string;
  title: string;
  desc: string;
  run: () => void;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [phIndex, setPhIndex] = useState(0);
  const { data, isLoading } = useSearch(submitted);
  const navigate = useNavigate();
  const openCompanion = useUIStore((s) => s.openCompanion);

  useEffect(() => {
    const t = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const submit = (q: string) => {
    setQuery(q);
    setSubmitted(q);
  };

  const actions: Action[] = [
    {
      icon: '✦',
      title: 'Ask the AI curator',
      desc: 'Describe a feeling, get a film',
      run: () => openCompanion(query || 'Recommend me a film for tonight'),
    },
    { icon: '◐', title: 'Discover by mood', desc: 'Tune the mood controls', run: () => navigate('/discover') },
    { icon: '⊕', title: 'Explore the galaxy', desc: 'Browse films in 3D', run: () => navigate('/galaxy') },
  ];

  const hasResults = submitted.length > 1;

  return (
    <PageTransition>
      <div className="min-h-screen px-6 py-10 pb-24 md:px-12">
        <div className="mx-auto max-w-2xl">
          {/* prompt box */}
          <div className="mb-6 text-center">
            <h1 className="display-fluid text-4xl text-text-primary md:text-5xl">What do you feel like watching?</h1>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
            className="glass flex items-center gap-3 px-5 py-4"
          >
            <span className="text-lg text-text-muted">⌕</span>
            <input
              autoFocus
              data-hoverable
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={PLACEHOLDERS[phIndex]}
              className="flex-1 border-0 bg-transparent font-ui text-base text-text-primary outline-none ring-0 placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
            <button
              data-hoverable
              type="submit"
              disabled={!query.trim()}
              className="bg-grad flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
            >
              ↑
            </button>
          </form>

          {/* suggestion chips */}
          {!hasResults && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <div className="eyebrow mb-3 text-center">Try searching</div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    data-hoverable
                    onClick={() => submit(s)}
                    className="glass glass-hover rounded-full px-4 py-2 font-ui text-sm text-text-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* quick actions */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {actions.map((a) => (
                  <button
                    key={a.title}
                    data-hoverable
                    onClick={a.run}
                    className="glass glass-hover flex flex-col items-start gap-1 p-4 text-left"
                  >
                    <span className="text-xl text-accent-gold">{a.icon}</span>
                    <span className="font-ui text-sm font-semibold text-text-primary">{a.title}</span>
                    <span className="font-ui text-xs text-text-muted">{a.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* results */}
        <AnimatePresence>
          {hasResults && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-12 max-w-7xl">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-mono text-xs text-accent-teal">Results for “{submitted}”</p>
                <button
                  data-hoverable
                  onClick={() => {
                    setQuery('');
                    setSubmitted('');
                  }}
                  className="font-ui text-xs text-text-muted hover:text-text-primary"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {isLoading
                  ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
                  : data?.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
              </div>
              {!isLoading && data?.length === 0 && (
                <p className="mt-12 text-center font-ui text-text-muted">No films found. Try a different phrase.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
