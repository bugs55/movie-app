"use client";

import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import useSWR from "swr";
import type { GetMoviesType } from "@/types/getMovies.type";
import type { GenreType } from "@/types/getGenres.type";
import { useState } from "react";

type FilterType = {
  genre: string;
  sortBy: string;
  year: string;
};

export default async function Home() {
  const [filters, setFilters] = useState<FilterType>({
    genre: "",
    sortBy: "popularity.desc",
    year: "",
  });

  function handleFilterChange(name: string, value: string | number): void {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const {
    data: movieData,
    error: movieError,
    isLoading: movieIsLoading,
  } = useSWR<GetMoviesType>("/api/getMovies", fetcher);
  const {
    data: genresData,
    error: genresError,
    isLoading: genresIsLoading,
  } = useSWR<GenreType[]>("/api/getGenres", fetcher);

  return (
    <div className="px-5">
      <div className="w-full flex gap-2">
        <div>
          <Select name="genre" value={filters.genre} onValueChange={(value) => handleFilterChange("genre", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {
                genresData &&
                genresData.map((genre) => (
                  <SelectItem key={genre.id} value={`${genre.id}`}>
                    {genre.name}
                  </SelectItem>
                ))
              }
              <SelectItem value="popularity.asc">
                Popularity ascending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select name="sortBy" value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBys", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity.asc">
                Popularity ascending
              </SelectItem>
              <SelectItem value="popularity.desc">
                Popularity descending
              </SelectItem>
              <SelectItem value="vote_average.asc">
                Vote average asceding
              </SelectItem>
              <SelectItem value="vote_average.desc">
                Vote average descending
              </SelectItem>
              <SelectItem value="primary_release_date.asc">
                Primary release date asceding
              </SelectItem>
              <SelectItem value="primary_release_date.desc">
                Primary release date descending
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[150px]">
          <Input type="text" placeholder="Year" value={filters.year} onChange={(e) => handleFilterChange(e.target.name, e.target.value)} />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3">
        {movieData ? (
          movieData.results.map((movie: any) => (
            <MovieCard
              key={movie.id}
              img={movie.poster_path}
              rating={movie.vote_average}
              title={movie.title}
              description={movie.overview}
            />
          ))
        ) : (
          <div>No movies found</div>
        )}
      </div>
    </div>
  );
}
