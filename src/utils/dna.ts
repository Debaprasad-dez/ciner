import type { MovieDNA, TMDBMovie } from '@/types/movie';

// Derive a stable Movie DNA fingerprint from TMDB metadata. Deterministic so
// the same movie always renders the same bars without an AI round-trip.
export function deriveDNA(movie: TMDBMovie): MovieDNA {
  const g = new Set(movie.genre_ids);
  const seed = movie.id;
  const jitter = (n: number) => ((seed * (n + 7)) % 23) / 23; // 0..1 stable per movie

  const has = (id: number, weight: number) => (g.has(id) ? weight : 0);
  const clamp = (v: number) => Math.max(0.08, Math.min(1, v));

  return {
    darkness: clamp(has(27, 0.6) + has(80, 0.4) + has(53, 0.3) + jitter(1) * 0.4),
    humor: clamp(has(35, 0.8) + has(16, 0.3) + jitter(2) * 0.3),
    romance: clamp(has(10749, 0.8) + has(18, 0.2) + jitter(3) * 0.3),
    action: clamp(has(28, 0.8) + has(12, 0.5) + has(53, 0.3) + jitter(4) * 0.3),
    complexity: clamp(has(9648, 0.6) + has(878, 0.5) + has(18, 0.3) + jitter(5) * 0.4),
    mindBending: clamp(has(878, 0.6) + has(9648, 0.5) + has(14, 0.3) + jitter(6) * 0.4),
    emotionalDepth: clamp(has(18, 0.7) + has(10749, 0.3) + has(36, 0.3) + jitter(7) * 0.4),
    pacing: clamp(has(28, 0.6) + has(53, 0.5) + (1 - jitter(8)) * 0.5),
  };
}
