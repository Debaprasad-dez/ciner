import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { TMDBMovie } from '@/types/movie';
import { posterUrl } from '@/services/tmdb';
import { GENRE_MAP, genreColor } from '@/utils/constants';
import { yearOf, ratingPct } from '@/utils/formatters';
import { deriveDNA } from '@/utils/dna';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';

const DNA_LABELS: { key: keyof ReturnType<typeof deriveDNA>; label: string }[] = [
  { key: 'darkness', label: 'Dark' },
  { key: 'emotionalDepth', label: 'Emotion' },
  { key: 'complexity', label: 'Complex' },
  { key: 'pacing', label: 'Pace' },
];

export default function MovieCard({ movie, index = 0 }: { movie: TMDBMovie; index?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const toggleWatchlist = useUserStore((s) => s.toggleWatchlist);
  const saved = useUserStore((s) => s.isWatchlisted(movie.id));
  const playMovie = useUIStore((s) => s.playMovie);
  const dna = deriveDNA(movie);
  const genres = movie.genre_ids.slice(0, 2).map((id) => GENRE_MAP[id]).filter(Boolean);
  const poster = posterUrl(movie.poster_path, 'w500');

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
  };
  const onLeave = () => {
    setHovered(false);
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 12) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        ref={ref}
        to={`/movie/${movie.id}`}
        data-hoverable
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        className="group relative block aspect-[2/3] w-full overflow-hidden rounded-2xl bg-surface-2"
        style={{ transition: 'transform 0.2s ease' }}
      >
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-[0.6]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-void-3 px-4 text-center font-display text-text-muted">
            {movie.title}
          </div>
        )}

        {/* rating badge */}
        <div className="absolute right-2 top-2 rounded-full bg-void/70 px-2 py-1 font-mono text-xs text-accent-teal backdrop-blur-sm">
          {ratingPct(movie.vote_average)}%
        </div>

        {/* play button — top-left corner, dark fade backing, starts embedded player */}
        <button
          data-hoverable
          aria-label={`Play ${movie.title}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            playMovie({ id: movie.id, title: movie.title });
          }}
          className={`absolute left-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-void/70 pl-0.5 text-sm text-text-primary backdrop-blur-sm transition-all duration-300 hover:bg-grad hover:text-white ${
            hovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          ▶
        </button>

        {/* hover overlay */}
        <motion.div
          initial={false}
          animate={{ y: hovered ? 0 : '101%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/95 to-transparent p-4"
        >
          <h3 className="font-display text-lg leading-tight text-text-primary">{movie.title}</h3>
          <p className="mt-1 font-ui text-xs text-text-secondary">
            {yearOf(movie.release_date)} · {ratingPct(movie.vote_average)}% match
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span
                key={g}
                className="rounded-full px-2 py-0.5 font-ui text-[10px] font-semibold"
                style={{ background: `${genreColor(g)}22`, color: genreColor(g) }}
              >
                {g}
              </span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {DNA_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-12 shrink-0 font-mono text-[9px] uppercase text-text-muted">{label}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hovered ? `${dna[key] * 100}%` : 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-crimson"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            data-hoverable
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            className={`mt-3 w-full rounded-full py-1.5 font-ui text-xs font-semibold transition-colors ${
              saved ? 'bg-accent-teal/20 text-accent-teal' : 'bg-surface-3 text-text-secondary hover:text-text-primary'
            }`}
          >
            {saved ? '✓ Saved' : '+ Save'}
          </button>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function MovieCardSkeleton() {
  return <div className="shimmer aspect-[2/3] w-full rounded-2xl" />;
}
