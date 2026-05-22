export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const GENRE_COLORS: Record<string, string> = {
  'Sci-Fi': '#7B5EA7',
  Thriller: '#E8624A',
  Drama: '#C9954C',
  Comedy: '#4ECDC4',
  Horror: '#8B2635',
  Romance: '#D17B9E',
  Action: '#E8624A',
  Mystery: '#5E6BA7',
  Fantasy: '#9B7EC7',
  Animation: '#4ECDC4',
  Adventure: '#C9954C',
  Crime: '#6B4E7A',
};

export const MOODS = [
  'Melancholic',
  'Euphoric',
  'Tense',
  'Dreamy',
  'Dark',
  'Playful',
  'Romantic',
  'Epic',
  'Mysterious',
  'Nostalgic',
  'Intellectual',
  'Raw',
] as const;

export function genreColor(name: string): string {
  return GENRE_COLORS[name] ?? '#7B5EA7';
}
