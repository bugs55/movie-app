import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";

export async function GET() {
  try{
    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>("https://api.themoviedb.org/3/discover/movie", {
        headers: { Authorization: auth },
      })
      .then((res) => res.data);
  
    return Response.json(data);
  } catch(err){
    console.error("Error fetching movies:", err);
    return new Response("Error fetching movies", { status: 500 });
  }
}
