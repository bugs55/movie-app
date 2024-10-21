import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";
import type { FilterType } from "@/types/Filter.type";
import type { ConfigType } from "@/types/ConfigType.type";

export async function POST(request: Request) {
  try {
    const body: FilterType = await request.json();
    const { genre, sortBy, year } = body;

    let query = `?sort_by=${sortBy}`;
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

    return Response.json({ ...data, ...config });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return new Response("Error fetching movies", { status: 500 });
  }
}
