import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";
import type { ConfigType } from "@/types/ConfigType.type";

type RequestBody = {
  search: string;
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { search } = body;

    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>(
        `https://api.themoviedb.org/3/search/movie?query=${search}`,
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
  } catch (error) {
    console.error("Error fetching movies:", error);

    return new Response("Error fetching movies", { status: 500 });
  }
}
