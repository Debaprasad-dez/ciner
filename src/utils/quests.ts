import type { SavedMovie } from '@/stores/userStore';
import { GENRE_MAP } from '@/utils/constants';

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
  xp: number;
  progress: (watched: SavedMovie[]) => number;
}

const decadeOf = (date: string) => Math.floor(parseInt(date?.slice(0, 4) || '0', 10) / 10) * 10;
const hasGenre = (m: SavedMovie, id: number) => m.genre_ids?.includes(id);

export const QUESTS: QuestDef[] = [
  {
    id: 'first-steps',
    title: 'First Frames',
    description: 'Mark your first 3 films as watched',
    icon: '🎬',
    goal: 3,
    xp: 150,
    progress: (w) => w.length,
  },
  {
    id: 'seventies',
    title: 'Decade Deep Dive: 1970s',
    description: 'Watch 3 films from the 1970s',
    icon: '📽️',
    goal: 3,
    xp: 300,
    progress: (w) => w.filter((m) => decadeOf(m.release_date) === 1970).length,
  },
  {
    id: 'dark-phase',
    title: 'Into the Dark',
    description: 'Watch 4 horror or thriller films',
    icon: '🌑',
    goal: 4,
    xp: 300,
    progress: (w) => w.filter((m) => hasGenre(m, 27) || hasGenre(m, 53)).length,
  },
  {
    id: 'spectrum',
    title: 'Emotional Spectrum',
    description: 'Watch films across 5 different genres',
    icon: '🌈',
    goal: 5,
    xp: 400,
    progress: (w) => {
      const genres = new Set<number>();
      w.forEach((m) => m.genre_ids?.forEach((g) => GENRE_MAP[g] && genres.add(g)));
      return genres.size;
    },
  },
  {
    id: 'critic',
    title: 'The Critic',
    description: 'Build a library of 10 watched films',
    icon: '🏆',
    goal: 10,
    xp: 600,
    progress: (w) => w.length,
  },
];

export interface QuestStatus extends QuestDef {
  current: number;
  complete: boolean;
}

export function questStatuses(watched: SavedMovie[]): QuestStatus[] {
  return QUESTS.map((q) => {
    const current = Math.min(q.goal, q.progress(watched));
    return { ...q, current, complete: current >= q.goal };
  });
}

export function totalXP(watched: SavedMovie[]): number {
  const base = watched.length * 100;
  const questXP = questStatuses(watched)
    .filter((q) => q.complete)
    .reduce((sum, q) => sum + q.xp, 0);
  return base + questXP;
}

export interface LevelInfo {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForLevel: number;
}

const LEVEL_STEP = 500;
const TITLES = ['Newcomer', 'Viewer', 'Enthusiast', 'Cinephile', 'Connoisseur', 'Auteur', 'Legend'];

export function levelInfo(xp: number): LevelInfo {
  const level = Math.floor(xp / LEVEL_STEP) + 1;
  return {
    level,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    xpIntoLevel: xp % LEVEL_STEP,
    xpForLevel: LEVEL_STEP,
  };
}
