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
import { GetMoviesType } from "@/types/getMovies.type";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfigUrlType } from "@/types/ConfigType.type";

type SearchProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type FetcherArgs = {
  arg: { search: string };
};

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

  useEffect(() => {
    if (searchDebounced) {
      trigger({ search: searchDebounced });
    }
  }, [searchDebounced, trigger]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type to search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
