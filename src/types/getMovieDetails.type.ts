export type GetMovieDetails = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type WatchProviders = {
  id: number;
  results: {
    [country: string]: {
      link: string;
      flatrate?: {
        display_priority: number;
        logo_path: string;
        provider_id: number;
        provider_name: string;
      }[];
      rent?: {
        display_priority: number;
        logo_path: string;
        provider_id: number;
        provider_name: string;
      }[];
      buy?: {
        display_priority: number;
        logo_path: string;
        provider_id: number;
        provider_name: string;
      }[];
    };
  };
};