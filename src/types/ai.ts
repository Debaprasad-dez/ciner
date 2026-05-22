export type Mood =
  | 'Melancholic'
  | 'Euphoric'
  | 'Tense'
  | 'Dreamy'
  | 'Dark'
  | 'Playful'
  | 'Romantic'
  | 'Epic'
  | 'Mysterious'
  | 'Nostalgic'
  | 'Intellectual'
  | 'Raw';

export interface MoodQuery {
  moods: Mood[];
  energy: number;
  tempo: 'Slow burn' | 'Measured' | 'Kinetic';
  genres: string[];
  runtime: '<90' | '90-150' | '150+' | null;
  era: [number, number];
}

export interface AIRecommendation {
  title: string;
  year: number;
  tmdb_id: number | null;
  why_you_match: string;
  emotional_notes: string;
  pacing: string;
  tone: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
