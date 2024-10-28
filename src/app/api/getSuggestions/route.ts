import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";
import type { ConfigType } from "@/types/ConfigType.type";

export async function GET() {
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

    const config = await axios
      .get<ConfigType>("https://api.themoviedb.org/3/configuration", {
        headers: { Authorization: auth },
      })
      .then((res) => ({
        secure_base_url: res.data.images.secure_base_url,
        base_url: res.data.images.base_url,
      }));

    return Response.json({ ...data, ...config });
  } catch (error) {
    console.error("Error fetching suggested movies:", error);

    return new Response("Error fetching suggested movies", { status: 500 });
  }
}
