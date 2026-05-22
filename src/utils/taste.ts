import { MOODS } from '@/utils/constants';
import type { SavedMovie } from '@/stores/userStore';
import type { Mood } from '@/types/ai';

// Genre id -> mood contributions. Drives the Taste DNA radar from watch history.
const GENRE_MOODS: Record<number, Partial<Record<Mood, number>>> = {
  18: { Melancholic: 1, Intellectual: 0.5, Raw: 0.5 }, // Drama
  35: { Playful: 1, Euphoric: 0.6 }, // Comedy
  27: { Dark: 1, Tense: 0.8 }, // Horror
  53: { Tense: 1, Mysterious: 0.6 }, // Thriller
  878: { Dreamy: 0.7, Intellectual: 0.8, Epic: 0.6 }, // Sci-Fi
  10749: { Romantic: 1, Dreamy: 0.5 }, // Romance
  9648: { Mysterious: 1, Intellectual: 0.6 }, // Mystery
  28: { Epic: 0.8, Tense: 0.5, Raw: 0.4 }, // Action
  12: { Epic: 1, Euphoric: 0.4 }, // Adventure
  16: { Playful: 0.8, Dreamy: 0.6 }, // Animation
  14: { Dreamy: 1, Epic: 0.5 }, // Fantasy
  36: { Nostalgic: 1, Epic: 0.5 }, // History
  10752: { Raw: 1, Tense: 0.6 }, // War
  80: { Dark: 0.8, Tense: 0.6 }, // Crime
  99: { Intellectual: 1, Raw: 0.5 }, // Documentary
  37: { Nostalgic: 0.8, Raw: 0.6 }, // Western
};

export function tasteVector(movies: SavedMovie[]): number[] {
  const totals: Record<string, number> = {};
  MOODS.forEach((m) => (totals[m] = 0));

  for (const movie of movies) {
    for (const gid of movie.genre_ids) {
      const contrib = GENRE_MOODS[gid];
      if (!contrib) continue;
      for (const [mood, w] of Object.entries(contrib)) {
        totals[mood] += w ?? 0;
      }
    }
  }

  const max = Math.max(1, ...Object.values(totals));
  // Floor at 0.12 so an empty/sparse profile still renders a visible shape.
  return MOODS.map((m) => Math.max(0.12, totals[m] / max));
}
