import axios from "axios";
import type { GenreDataType } from "@/types/getGenres.type";

export async function GET() {
  try {
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GenreDataType>("https://api.themoviedb.org/3/genre/movie/list", {
        headers: { Authorization: auth },
      })
      .then((res) => res.data.genres);

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching genres:", error);

    return new Response("Error fetching genres", { status: 500 });
  }
}
