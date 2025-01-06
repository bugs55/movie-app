"use server";

import axios from "axios";
import type { GetMoviesType, Result } from "@/types/getMovies.type";
import type { FilterType } from "@/types/Filter.type";
import type { ConfigType } from "@/types/ConfigType.type";
import type { PagesType } from "@/types/Pages.type";
import type { GenreDataType } from "@/types/getGenres.type";
import { getUrlConfig } from "./getUrlConfig";
import { getGenres } from "./getGenres";

type ParamsType = {
  filters: FilterType;
  page: PagesType["currentPage"];
};

export async function getMovies(params: ParamsType) {
  const { genre, sortBy, year } = params.filters;
  const page = params.page;

  let query = `?page=${page}&sort_by=${sortBy}`;
  if (genre !== "All") {
    query += `&with_genres=${genre}`;
  }
  if (year) {
    query += `&primary_release_year=${year}`;
  }

  try {
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>(
        `https://api.themoviedb.org/3/discover/movie${query}`,
        {
          headers: { Authorization: auth },
        }
      )
      .then((res) => res.data);

    const config = await getUrlConfig();
    const allGenres = await getGenres();

    let newResults: Result[] = [];

    if (data.results.length > 0) {
      newResults = data.results.map((movie) => {
        const genreNames: string[] = movie.genre_ids.map((genreId) => {
          const genre = allGenres.find((g) => g.id === genreId);
          return genre ? genre.name : "";
        });
        return {
          ...movie,
          genres: genreNames,
        };
      });

      data.results = newResults;
    }

    return { ...data, ...config };
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Error fetching movies");
  }
}
