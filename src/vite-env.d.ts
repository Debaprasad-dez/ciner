/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_API_READ_ACCESS_TOKEN: string;
  readonly VITE_TMDB_BASE_URL: string;
  readonly VITE_TMDB_IMAGE_BASE: string;
  readonly VITE_AI_PROXY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
