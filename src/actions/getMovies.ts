"use server";

import axios from "axios";
import type { GetMoviesType, Result } from "@/types/getMovies.type";
import type { FilterType } from "@/types/Filter.type";
import type { ConfigType } from "@/types/ConfigType.type";
import type { PagesType } from "@/types/Pages.type";
import type { GenreDataType } from "@/types/getGenres.type";

type Request = {
  filters: FilterType;
  page: PagesType["currentPage"];
};

export async function getMovies(request: Request) {
  const { genre, sortBy, year } = request.filters;
  const page = request.page;

  let query = `?page=${page}&sort_by=${sortBy}`;
  if (genre !== "All") {
    query += `&with_genres=${genre}`;
  }
  if (year) {
    query += `&primary_release_year=${year}`;
  }
}
