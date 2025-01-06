"use server";

import axios from "axios";
import type { GenreDataType } from "@/types/getGenres.type";

export async function getGenres() {
  try {
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GenreDataType>("https://api.themoviedb.org/3/genre/movie/list", {
        headers: { Authorization: auth },
      })
      .then((res) => res.data.genres);

    return data;
  } catch (error) {
    console.error("Error fetching genres:", error);

    throw new Error("Error fetching genres");
  }
}
