import axios from "axios";
import type { ConfigType } from "@/types/ConfigType.type";
import { GetMovieDetails, WatchProviders } from "@/types/getMovieDetails.type";

type RequestBody = {
  id: number;
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { id } = body;

    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMovieDetails>(`https://api.themoviedb.org/3/movie/${id}`, {
        headers: { Authorization: auth },
      })
      .then((res) => res.data);

    const config = await axios
      .get<ConfigType>("https://api.themoviedb.org/3/configuration", {
        headers: { Authorization: auth },
      })
      .then((res) => ({
        secure_base_url: res.data.images.secure_base_url,
        base_url: res.data.images.base_url,
      }));

    const watchProviders = await axios
      .get<WatchProviders>(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
        {
          headers: { Authorization: auth },
        }
      )
      .then((res) => res.data);

    return Response.json({
      ...data,
      ...config,
      watch_providers: watchProviders,
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return new Response("Error fetching movies", { status: 500 });
  }
}
