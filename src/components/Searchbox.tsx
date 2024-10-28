"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { GetMoviesType, Result } from "@/types/getMovies.type";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfigUrlType } from "@/types/ConfigType.type";
import Image from "next/image";
import { Spinner } from "./ui/spinner";

type SearchProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type FetcherArgs = {
  arg: { search: string };
};

type MovieItemProps = {
  movie: Result;
  secure_base_url: ConfigUrlType["secure_base_url"];
};

function MovieItem({ movie, secure_base_url }: MovieItemProps) {
  const { title, poster_path, overview, release_date } = movie;

  function getYear(date: string) {
    return date.split("-")[0];
  }

  return (
    <CommandItem className="flex items-center gap-3">
      <div className="w-[12%]">
        {poster_path ? (
          <Image
            src={`${secure_base_url}w92${poster_path}`}
            alt={title}
            width={92}
            height={138}
            className="w-full rounded-md"
          />
        ) : (
          <div className="w-full h-[110px] rounded-md bg-neutral-200/50"></div>
        )}
      </div>
      <div className="flex flex-col w-[88%]">
        <p className="text-base font-bold">{title}</p>
        <p className="text-sm text-neutral-500 mb-1">{getYear(release_date)}</p>
        <p className="text-base text-neutral-400 line-clamp-1">{overview}</p>
      </div>
    </CommandItem>
  );
}

export default function Searchbox({ open, setOpen }: SearchProps) {
  const [search, setSearch] = useState<string>("");
  const searchDebounced = useDebounce<string>(search, 600);

  const fetcher = (url: string, { arg }: FetcherArgs) =>
    axios.post(url, { search: arg.search }).then((res) => res.data);

  const { data, error, trigger, isMutating } = useSWRMutation<
    GetMoviesType & ConfigUrlType,
    Error,
    string,
    FetcherArgs["arg"]
  >("/api/searchMovies", fetcher);

  const suggestionFetcher = (url: string) =>
    axios.get(url).then((res) => res.data);

  const {
    data: suggestData,
    error: suggestError,
    isLoading: suggestIsLoading,
  } = useSWR<GetMoviesType & ConfigUrlType>(
    "/api/getSuggestions",
    suggestionFetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (searchDebounced) {
      trigger({ search: searchDebounced });
    }
  }, [searchDebounced, trigger]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command shouldFilter={false} className="max-h-[500px] overflow-y-auto">
        <CommandInput
          placeholder="Type to search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {isMutating ? (
            <Spinner size="medium" className="my-3" />
          ) : error ? (
            <div>No results found.</div>
          ) : data && data.results.length > 0 && searchDebounced.length > 0 ? (
            <CommandGroup heading="Movies">
              {data.results.map((movie) => (
                <MovieItem
                  key={movie.id}
                  movie={movie}
                  secure_base_url={data.secure_base_url}
                />
              ))}
            </CommandGroup>
          ) : searchDebounced.length > 0 ? (
            <div>No results found.</div>
          ) : null}
          {/* <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup> */}
          {suggestIsLoading ? (
            <Spinner size="medium" className="my-3" />
          ) : suggestData && suggestData.results.length > 0 && !suggestError ? (
            <CommandGroup heading="Suggestions">
              {suggestData.results.map((movie) => (
                <MovieItem
                  key={movie.id}
                  movie={movie}
                  secure_base_url={suggestData.secure_base_url}
                />
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
