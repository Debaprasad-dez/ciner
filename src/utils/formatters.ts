export function formatRuntime(minutes?: number): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function yearOf(date?: string): string {
  if (!date) return '—';
  return date.slice(0, 4);
}

export function ratingPct(vote: number): number {
  return Math.round(vote * 10);
}
