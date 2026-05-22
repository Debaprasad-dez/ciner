export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  runtime?: number;
  genres?: TMDBGenre[];
  tagline?: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDNA {
  darkness: number;
  humor: number;
  romance: number;
  action: number;
  complexity: number;
  mindBending: number;
  emotionalDepth: number;
  pacing: number;
}
