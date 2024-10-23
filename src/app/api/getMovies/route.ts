import axios from "axios";
import type { GetMoviesType, Result } from "@/types/getMovies.type";
import type { FilterType } from "@/types/Filter.type";
import type { ConfigType } from "@/types/ConfigType.type";
import type { PagesType } from "@/types/Pages.type";
import type { GenreDataType } from "@/types/getGenres.type";

type RequestBody = {
  filters: FilterType;
  page: PagesType["currentPage"];
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { genre, sortBy, year } = body.filters;
    const page = body.page;

    let query = `?page=${page}&sort_by=${sortBy}`;
    if (genre !== "All") {
      query += `&with_genres=${genre}`;
    }
    if (year) {
      query += `&primary_release_year=${year}`;
    }

    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>(
        `https://api.themoviedb.org/3/discover/movie${query}`,
        {
          headers: { Authorization: auth },
        }
      )
      .then((res) => res.data);

    const config = await axios
      .get<ConfigType>("https://api.themoviedb.org/3/configuration", {
        headers: { Authorization: auth },
      })
      .then((res) => ({
        secure_base_url: res.data.images.secure_base_url,
        base_url: res.data.images.base_url,
      }));

    const allGenres = await axios
      .get<GenreDataType>("https://api.themoviedb.org/3/genre/movie/list", {
        headers: { Authorization: auth },
      })
      .then((res) => res.data.genres);

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

    return Response.json({ ...data, ...config });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return new Response("Error fetching movies", { status: 500 });
  }
}
