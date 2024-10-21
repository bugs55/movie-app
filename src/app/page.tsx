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
import type { GetMoviesType, Result } from "@/types/getMovies.type";
import type { GenreType } from "@/types/getGenres.type";
import { useState } from "react";
import MovieCardLoading from "@/components/MovieCardLoading";
import { Skeleton } from "@/components/ui/skeleton";
import type { FilterType } from "@/types/Filter.type";
import type { ConfigUrlType } from "@/types/ConfigType.type";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function Home() {
  const defaultFilters = {
    genre: "All",
    sortBy: "popularity.desc",
    year: "",
  };

  const [filters, setFilters] = useState<FilterType>(defaultFilters);

  function handleFilterChange(name: string, value: string | number): void {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  const fetcherGenres = (url: string) => axios.get(url).then((res) => res.data);
  const fetcherMovies = ([url, filters]: [string, FilterType]) =>
    axios.post(url, filters).then((res) => res.data);
  const {
    data: movieData,
    error: movieError,
    isLoading: movieIsLoading,
  } = useSWR<GetMoviesType & ConfigUrlType>(
    ["/api/getMovies", filters],
    fetcherMovies,
    {
      revalidateOnFocus: false,
    }
  );
  const {
    data: genresData,
    error: genresError,
    isLoading: genresIsLoading,
  } = useSWR<GenreType[]>("/api/getGenres", fetcherGenres, {
    revalidateOnFocus: false,
  });

  return (
    <div className="px-5">
      <div className="w-full flex gap-2">
        {genresIsLoading ? (
          <>
            <Skeleton className="rounded-md w-[180px] h-[40px]" />
            <Skeleton className="rounded-md w-[180px] h-[40px]" />
            <Skeleton className="rounded-md w-[180px] h-[40px]" />
          </>
        ) : !genresError && genresData && genresData.length > 0 ? (
          <>
            <div>
              <Select
                name="genre"
                value={filters.genre}
                onValueChange={(value) => handleFilterChange("genre", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {genresData.map((genre) => (
                    <SelectItem key={genre.id} value={`${genre.id}`}>
                      {genre.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="popularity.asc">
                    Popularity ascending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                name="sortBy"
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
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
            <div className="w-[180px]">
              <Input
                type="text"
                placeholder="Year"
                value={filters.year}
                onChange={(e) =>
                  handleFilterChange(e.target.name, e.target.value)
                }
              />
            </div>
            <div>
              <Button
                variant="ghost"
                onClick={() => setFilters(defaultFilters)}
              >
                <Trash2 size={20} /> Clear
              </Button>
            </div>
          </>
        ) : null}
      </div>
      <div className="mt-12 grid grid-cols-4 gap-y-8 gap-x-7">
        {!movieIsLoading ? (
          !movieError && movieData && movieData.results.length > 0 ? (
            movieData.results?.map((movie: Result) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                secure_base_url={movieData.secure_base_url}
              />
            ))
          ) : (
            <div className="text-center text-xl font-semibold">
              No movies found
            </div>
          )
        ) : (
          <>
            <MovieCardLoading />
            <MovieCardLoading />
            <MovieCardLoading />
            <MovieCardLoading />
            <MovieCardLoading />
            <MovieCardLoading />
            <MovieCardLoading />
            <MovieCardLoading />
          </>
        )}
      </div>
    </div>
  );
}
