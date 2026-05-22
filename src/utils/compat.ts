import { MOODS } from '@/utils/constants';

// Encode a 12-mood taste vector (0..1 each) into a short shareable code.
// Each value -> 1 byte (0..255), packed and base64url-encoded.
export function encodeTaste(vec: number[]): string {
  const bytes = vec.slice(0, MOODS.length).map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255));
  const bin = String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeTaste(code: string): number[] | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const vec = Array.from(bin, (ch) => ch.charCodeAt(0) / 255);
    if (vec.length !== MOODS.length) return null;
    return vec;
  } catch {
    return null;
  }
}

// Cosine similarity -> 0..100 compatibility score.
export function compatibilityScore(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < MOODS.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  const cos = dot / (Math.sqrt(na) * Math.sqrt(nb));
  return Math.round(cos * 100);
}

// Shared top moods where both score high.
export function sharedMoods(a: number[], b: number[], topN = 4): string[] {
  return MOODS.map((m, i) => ({ m, s: Math.min(a[i], b[i]) }))
    .sort((x, y) => y.s - x.s)
    .slice(0, topN)
    .filter((x) => x.s > 0.2)
    .map((x) => x.m);
}
