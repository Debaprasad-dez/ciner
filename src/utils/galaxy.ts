import type { TMDBMovie } from '@/types/movie';
import { GENRE_MAP, genreColor } from '@/utils/constants';

export interface GalaxyNode {
  movie: TMDBMovie;
  position: [number, number, number];
  scale: number;
  glow: number;
  genre: string;
  color: string;
}

export interface Constellation {
  genre: string;
  color: string;
  center: [number, number, number];
  nodeIds: number[];
}

// Genres that get their own named constellation, with fixed cluster centers.
const CLUSTERS: { genre: string; center: [number, number, number] }[] = [
  { genre: 'Sci-Fi', center: [14, 6, -4] },
  { genre: 'Action', center: [-14, 4, 2] },
  { genre: 'Drama', center: [2, -8, 8] },
  { genre: 'Thriller', center: [-8, 8, -10] },
  { genre: 'Comedy', center: [10, -6, 10] },
  { genre: 'Horror', center: [-10, -8, -6] },
  { genre: 'Romance', center: [6, 10, 4] },
  { genre: 'Animation', center: [0, 2, -14] },
];

const FALLBACK: [number, number, number] = [0, 0, 0];

function primaryGenre(m: TMDBMovie): string {
  for (const id of m.genre_ids ?? []) {
    const name = GENRE_MAP[id];
    if (CLUSTERS.some((c) => c.genre === name)) return name;
  }
  return GENRE_MAP[m.genre_ids?.[0]] ?? 'Drama';
}

// Deterministic jitter so layout is stable across renders.
function jitter(seed: number, i: number): number {
  return (((seed * 9301 + (i + 1) * 49297) % 233280) / 233280 - 0.5) * 7;
}

export function buildGalaxy(movies: TMDBMovie[]): {
  nodes: GalaxyNode[];
  constellations: Constellation[];
} {
  const byGenre = new Map<string, number[]>();

  const nodes: GalaxyNode[] = movies.map((movie) => {
    const genre = primaryGenre(movie);
    const cluster = CLUSTERS.find((c) => c.genre === genre);
    const center = cluster?.center ?? FALLBACK;
    const position: [number, number, number] = [
      center[0] + jitter(movie.id, 1),
      center[1] + jitter(movie.id, 2),
      center[2] + jitter(movie.id, 3),
    ];
    const popNorm = Math.min(1, movie.popularity / 400);
    const list = byGenre.get(genre) ?? [];
    list.push(movie.id);
    byGenre.set(genre, list);

    return {
      movie,
      position,
      scale: 0.6 + popNorm * 0.9,
      glow: movie.vote_average / 10,
      genre,
      color: genreColor(genre),
    };
  });

  const constellations: Constellation[] = CLUSTERS.filter((c) => byGenre.has(c.genre)).map((c) => ({
    genre: c.genre,
    color: genreColor(c.genre),
    center: c.center,
    nodeIds: byGenre.get(c.genre)!,
  }));

  return { nodes, constellations };
}
