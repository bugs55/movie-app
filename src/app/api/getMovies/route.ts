import axios from "axios";
import type { GetMoviesType } from "@/types/getMovies.type";
import { FilterType } from "@/types/Filter.type";

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

export async function POST(request: Request) {
  try{
    const body: FilterType = await request.json();
    const { genre, sortBy, year} = body;

    let query = `?sort_by=${sortBy}`;
    if (genre !== "All") {
      query += `&with_genres=${genre}`;
    }
    if (year) {
      query += `&primary_release_year=${year}`;
    }

    const auth = `Bearer ${process.env.API_TOKEN}`;
    const data = await axios
      .get<GetMoviesType>(`https://api.themoviedb.org/3/discover/movie${query}`, {
        headers: { Authorization: auth },
      })
      .then((res) => res.data);
  
    return Response.json(data);
  } catch(err){
    console.error("Error fetching movies:", err);
    return new Response("Error fetching movies", { status: 500 });
  }
}
