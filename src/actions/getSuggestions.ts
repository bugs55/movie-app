"use server";

import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";
import { getUrlConfig } from "./getUrlConfig";

export async function getSuggestions() {
  try {
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>("https://api.themoviedb.org/3/movie/top_rated", {
        headers: { Authorization: auth },
      })
      .then((res) => res.data)
      .then((data) => {
        data.results = data.results.slice(0, 3);
        return data;
      });

    const config = await getUrlConfig();

    return { ...data, ...config };
  } catch (error) {
    console.error("Error fetching suggested movies:", error);
    throw new Error("Error fetching suggested movies");
  }
}
