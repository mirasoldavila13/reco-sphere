export interface Genre {
  id: number;
  name: string;
}

export interface TrendingItem {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string; //  movies
  name?: string; // TV shows and persons
  genre_ids?: number[];
  poster_path?: string;
}

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export interface GenreResponse {
  movieGenres: Genre[];
  tvGenres: Genre[];
}
