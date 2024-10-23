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
import { useState, useReducer, useEffect } from "react";
import MovieCardLoading from "@/components/MovieCardLoading";
import { Skeleton } from "@/components/ui/skeleton";
import type { FilterType } from "@/types/Filter.type";
import type { ConfigUrlType } from "@/types/ConfigType.type";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { PagesType } from "@/types/Pages.type";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const defaultFilters: FilterType = {
    genre: "All",
    sortBy: "popularity.desc",
    year: "",
  };

  const defaultPages: PagesType = {
    currentPage: 1,
    totalPages: 1,
  };

  function pagesReducer(
    state: PagesType,
    action: {
      type:
        | "previous"
        | "next"
        | "toFirst"
        | "toLast"
        | "setTotalPages"
        | "clearPages";
      payload?: PagesType["totalPages"];
    }
  ): PagesType {
    switch (action.type) {
      case "previous":
        return {
          ...state,
          currentPage: state.currentPage - 1,
        };
      case "next":
        return {
          ...state,
          currentPage: state.currentPage + 1,
        };
      case "toFirst":
        return {
          ...state,
          currentPage: 1,
        };
      case "toLast":
        return {
          ...state,
          currentPage: state.totalPages,
        };
      case "setTotalPages":
        return {
          ...state,
          totalPages: action.payload || 1,
        };
      case "clearPages":
        return defaultPages;
      default:
        return state;
    }
  }

  const [filters, setFilters] = useState<FilterType>(defaultFilters);
  const [pages, dispatchPages] = useReducer(pagesReducer, defaultPages);
  const filtersDebounced = useDebounce<FilterType>(filters, 600);
  const currentPageDebounced = useDebounce<PagesType["currentPage"]>(
    pages.currentPage,
    600
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pages]);

  function handleFilterChange(name: string, value: string | number): void {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  }

  function handleClearFilters(): void {
    setFilters(defaultFilters);
    dispatchPages({ type: "clearPages" });
  }

  const fetcherGenres = (url: string) => axios.get(url).then((res) => res.data);
  const fetcherMovies = ([url, filters, currentPage]: [
    string,
    FilterType,
    PagesType["currentPage"]
  ]) =>
    axios
      .post<GetMoviesType & ConfigUrlType>(url, { filters, page: currentPage })
      .then((res) => res.data)
      .then((data) => {
        dispatchPages({ type: "setTotalPages", payload: data.total_pages });
        return data;
      });
  const {
    data: movieData,
    error: movieError,
    isLoading: movieIsLoading,
  } = useSWR<GetMoviesType & ConfigUrlType>(
    ["/api/getMovies", filtersDebounced, currentPageDebounced],
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
                name="year"
                value={filters.year}
                onChange={(e) =>
                  handleFilterChange(e.target.name, e.target.value)
                }
              />
            </div>
            <div>
              <Button variant="ghost" onClick={() => handleClearFilters()}>
                <Trash2 size={20} /> Clear
              </Button>
            </div>
          </>
        ) : null}
      </div>
      <div className="mt-12 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-y-8 gap-x-7">
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
            <div className="text-center text-xl font-semibold col-span-4">
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
      <div className="mt-6 mb-4 flex justify-center items-center gap-5 text-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={pages.currentPage === 1}
            onClick={() => dispatchPages({ type: "toFirst" })}
            size="icon"
          >
            <ChevronFirst size={20} />
          </Button>
          <Button
            variant="ghost"
            disabled={pages.currentPage === 1}
            onClick={() => dispatchPages({ type: "previous" })}
            size="sm"
          >
            <ChevronLeft size={20} />
            Previous
          </Button>
        </div>
        <div>
          {pages.currentPage} / {pages.totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={pages.currentPage === pages.totalPages}
            onClick={() => dispatchPages({ type: "next" })}
            size="sm"
          >
            Next
            <ChevronRight size={20} />
          </Button>
          <Button
            variant="ghost"
            disabled={pages.currentPage === pages.totalPages}
            onClick={() => dispatchPages({ type: "toLast" })}
            size="icon"
          >
            <ChevronLast size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
