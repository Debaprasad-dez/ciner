import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TMDBMovie } from '@/types/movie';

export interface SavedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  vote_average: number;
  release_date: string;
  savedAt: number;
}

interface UserState {
  watchlist: SavedMovie[];
  watched: SavedMovie[];
  toggleWatchlist: (m: TMDBMovie) => void;
  toggleWatched: (m: TMDBMovie) => void;
  isWatchlisted: (id: number) => boolean;
  isWatched: (id: number) => boolean;
}

function toSaved(m: TMDBMovie): SavedMovie {
  return {
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    genre_ids: m.genre_ids ?? m.genres?.map((g) => g.id) ?? [],
    vote_average: m.vote_average,
    release_date: m.release_date,
    savedAt: Date.now(),
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      watched: [],
      toggleWatchlist: (m) =>
        set((s) => ({
          watchlist: s.watchlist.some((x) => x.id === m.id)
            ? s.watchlist.filter((x) => x.id !== m.id)
            : [toSaved(m), ...s.watchlist],
        })),
      toggleWatched: (m) =>
        set((s) => ({
          watched: s.watched.some((x) => x.id === m.id)
            ? s.watched.filter((x) => x.id !== m.id)
            : [toSaved(m), ...s.watched],
        })),
      isWatchlisted: (id) => get().watchlist.some((x) => x.id === id),
      isWatched: (id) => get().watched.some((x) => x.id === id),
    }),
    { name: 'cineai-user' },
  ),
);
