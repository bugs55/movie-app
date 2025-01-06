"use server";

import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";
import { getUrlConfig } from "./getUrlConfig";

export async function searchMovies(search: string) {
  try {
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>(
        `https://api.themoviedb.org/3/search/movie?query=${search}`,
        {
          headers: { Authorization: auth },
        }
      )
      .then((res) => res.data);

    const config = getUrlConfig();

    return { ...data, ...config };
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Error fetching movies");
  }
}
