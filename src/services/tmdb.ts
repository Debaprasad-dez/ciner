import axios from 'axios';
import type { TMDBListResponse, TMDBMovie } from '@/types/movie';

const BASE = import.meta.env.VITE_TMDB_BASE_URL as string;
const TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN as string;
const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE as string;

const tmdb = axios.create({
  baseURL: BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/json',
  },
});

export function posterUrl(path: string | null, size: 'w342' | 'w500' | 'w780' = 'w500'): string {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
}

export async function getTrending(window: 'day' | 'week' = 'week'): Promise<TMDBMovie[]> {
  const { data } = await tmdb.get<TMDBListResponse<TMDBMovie>>(`/trending/movie/${window}`);
  return data.results;
}

export async function getPopular(page = 1): Promise<TMDBMovie[]> {
  const { data } = await tmdb.get<TMDBListResponse<TMDBMovie>>('/movie/popular', { params: { page } });
  return data.results;
}

export async function getTopRated(page = 1): Promise<TMDBMovie[]> {
  const { data } = await tmdb.get<TMDBListResponse<TMDBMovie>>('/movie/top_rated', { params: { page } });
  return data.results;
}

export async function getMovie(id: number): Promise<TMDBMovie> {
  const { data } = await tmdb.get<TMDBMovie>(`/movie/${id}`);
  return data;
}

export async function getSimilar(id: number): Promise<TMDBMovie[]> {
  const { data } = await tmdb.get<TMDBListResponse<TMDBMovie>>(`/movie/${id}/recommendations`);
  return data.results;
}

export async function searchMovies(query: string, page = 1): Promise<TMDBMovie[]> {
  if (!query.trim()) return [];
  const { data } = await tmdb.get<TMDBListResponse<TMDBMovie>>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data.results;
}

export interface DiscoverParams {
  with_genres?: string;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'with_runtime.gte'?: number;
  'with_runtime.lte'?: number;
  sort_by?: string;
  'vote_count.lte'?: number;
  'vote_count.gte'?: number;
  page?: number;
}

export async function discoverMovies(params: DiscoverParams): Promise<TMDBMovie[]> {
  const { data } = await tmdb.get<TMDBListResponse<TMDBMovie>>('/discover/movie', {
    params: { include_adult: false, ...params },
  });
  return data.results;
}
