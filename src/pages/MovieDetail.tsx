import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovie, useSimilar } from '@/hooks/useTMDB';
import { backdropUrl, posterUrl } from '@/services/tmdb';
import { formatRuntime, yearOf, ratingPct } from '@/utils/formatters';
import { deriveDNA } from '@/utils/dna';
import { GENRE_MAP, genreColor } from '@/utils/constants';
import MovieRow from '@/components/cinema/MovieRow';
import MagneticButton from '@/components/ui/MagneticButton';
import PageTransition from '@/components/layout/PageTransition';
import RatingRing from '@/components/cinema/RatingRing';
import EmotionalArc from '@/components/cinema/EmotionalArc';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useMovieAnalysis } from '@/hooks/useAI';

const DNA_BARS: { key: keyof ReturnType<typeof deriveDNA>; label: string }[] = [
  { key: 'darkness', label: 'Darkness' },
  { key: 'humor', label: 'Humor' },
  { key: 'romance', label: 'Romance' },
  { key: 'action', label: 'Action' },
  { key: 'complexity', label: 'Complexity' },
  { key: 'mindBending', label: 'Mind-bending' },
  { key: 'emotionalDepth', label: 'Emotional depth' },
  { key: 'pacing', label: 'Pacing' },
];

export default function MovieDetail() {
  const { id } = useParams();
  const movieId = Number(id);
  const { data: movie, isLoading } = useMovie(movieId);
  const { data: similar } = useSimilar(movieId);
  const { toggleWatchlist, toggleWatched, isWatchlisted, isWatched } = useUserStore();
  const setActiveMovie = useUIStore((s) => s.setActiveMovie);
  const playMovie = useUIStore((s) => s.playMovie);
  const watchPartyEnabled = useSettingsStore((s) => s.flags.watchParty);
  const analysis = useMovieAnalysis(movie?.title, yearOf(movie?.release_date));

  useEffect(() => {
    if (!movie) return;
    setActiveMovie({
      title: movie.title,
      year: yearOf(movie.release_date),
      rating: movie.vote_average,
      genres: (movie.genres ?? movie.genre_ids?.map((g) => ({ id: g, name: GENRE_MAP[g] })) ?? [])
        .map((g) => g.name)
        .filter(Boolean),
      overview: movie.overview,
    });
    return () => setActiveMovie(null);
  }, [movie, setActiveMovie]);

  if (isLoading || !movie)
    return <div className="shimmer h-[60vh] w-full" />;

  const saved = isWatchlisted(movie.id);
  const seen = isWatched(movie.id);

  const dna = deriveDNA(movie);
  const genres = (movie.genres ?? movie.genre_ids?.map((g) => ({ id: g, name: GENRE_MAP[g] })) ?? []).filter(Boolean);

  return (
    <PageTransition>
      <div className="pb-24 md:pb-12">
        {/* HERO */}
        <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
          {movie.backdrop_path && (
            <img src={backdropUrl(movie.backdrop_path, 'original')} alt={movie.title} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/20" />

          <div className="relative z-10 flex h-full items-end gap-8 p-6 md:p-12">
            {movie.poster_path && (
              <motion.img
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                src={posterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="hidden w-56 rounded-2xl shadow-glow md:block"
              />
            )}
            <div className="max-w-2xl">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl italic md:text-6xl">
                {movie.title}
              </motion.h1>
              {movie.tagline && <p className="mt-2 font-ui text-text-secondary">{movie.tagline}</p>}
              <div className="mt-4 flex items-center gap-5 font-mono text-sm text-text-secondary">
                <RatingRing pct={ratingPct(movie.vote_average)} />
                <span>{yearOf(movie.release_date)}</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span key={g.id} className="rounded-full px-3 py-1 font-ui text-xs" style={{ background: `${genreColor(g.name)}22`, color: genreColor(g.name) }}>
                    {g.name}
                  </span>
                ))}
              </div>
              <p className="mt-4 max-w-xl font-ui text-sm text-text-secondary">{movie.overview}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton onClick={() => playMovie({ id: movie.id, title: movie.title })}>▶ Watch Now</MagneticButton>
                <MagneticButton variant="ghost" onClick={() => toggleWatched(movie)}>
                  {seen ? '✓ Watched' : '+ Mark Watched'}
                </MagneticButton>
                <MagneticButton variant="ghost" onClick={() => toggleWatchlist(movie)}>
                  {saved ? '✓ In List' : '+ Add to List'}
                </MagneticButton>
                {watchPartyEnabled && (
                  <Link to={`/watchparty/${movie.id}`}>
                    <MagneticButton variant="ghost">◎ Watch Party</MagneticButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DNA */}
        <section className="px-6 py-12 md:px-12">
          <h2 className="mb-6 font-display text-3xl italic">Movie DNA</h2>
          <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
            {DNA_BARS.map(({ key, label }, i) => (
              <div key={key}>
                <div className="mb-1 flex justify-between font-ui text-sm">
                  <span className="text-text-secondary">{label}</span>
                  <span className="font-mono text-text-muted">{Math.round(dna[key] * 100)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${dna[key] * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.06 }}
                    className="h-full rounded-full bg-gradient-to-r from-surface-3 to-accent-crimson"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why you'll like this */}
        <section className="px-6 py-8 md:px-12">
          <h2 className="mb-4 font-display text-3xl italic">Why you'll like this</h2>
          {analysis.isLoading ? (
            <div className="shimmer h-16 max-w-3xl rounded-xl" />
          ) : analysis.data?.why ? (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl font-display text-xl leading-relaxed text-text-secondary"
            >
              {analysis.data.why}
            </motion.p>
          ) : (
            <p className="font-ui text-sm text-text-muted">Analysis unavailable.</p>
          )}
        </section>

        {/* Emotional Arc */}
        {(analysis.isLoading || (analysis.data?.arc?.length ?? 0) > 0) && (
          <section className="px-6 py-8 md:px-12">
            <h2 className="mb-6 font-display text-3xl italic">Emotional Arc</h2>
            {analysis.isLoading ? (
              <div className="shimmer h-48 rounded-xl" />
            ) : (
              <EmotionalArc arc={analysis.data!.arc} />
            )}
          </section>
        )}

        {/* Scene Explorer */}
        {(analysis.data?.scenes?.length ?? 0) > 0 && (
          <section className="px-6 py-8 md:px-12">
            <h2 className="mb-6 font-display text-3xl italic">Scene Explorer</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {analysis.data!.scenes.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass w-72 shrink-0 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-accent-teal">{s.timestamp}</span>
                    <span className="rounded-full bg-accent-violet/20 px-2 py-0.5 font-ui text-[10px] text-accent-violet">{s.mood}</span>
                  </div>
                  <h3 className="font-display text-lg italic">{s.title}</h3>
                  <p className="mt-2 font-ui text-xs leading-relaxed text-text-secondary">{s.analysis}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        <div className="px-6 md:px-12">
          <MovieRow title="Similar Films" movies={similar} loading={!similar} />
        </div>
      </div>
    </PageTransition>
  );
}
