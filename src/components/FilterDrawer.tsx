"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Trash2 } from "lucide-react";
import { GenreType } from "@/types/getGenres.type";
import { FilterType } from "@/types/Filter.type";
import { Spinner } from "./ui/spinner";

type FilterDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleClearFilters: () => void;
  handleFilterChange: (name: string, value: string | number) => void;
  filters: FilterType;
  genresData: GenreType[] | undefined;
  isLoadig: boolean;
};

export default function FilterDrawer({
  open,
  setOpen,
  handleClearFilters,
  handleFilterChange,
  filters,
  genresData,
  isLoadig,
}: FilterDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={true}>
        <Button variant={"ghost"} size={"icon"}>
          <Filter size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter movies</DrawerTitle>
          <DrawerDescription>
            Set up filters to browse movies more efficiently.
          </DrawerDescription>
        </DrawerHeader>
        {isLoadig ? (
          <Spinner size={"medium"} className="my-3" />
        ) : (
          <div className="flex flex-col gap-2 p-4">
            <div>
              <Select
                name="genre"
                value={filters?.genre}
                onValueChange={(value) => handleFilterChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {genresData?.map((genre) => (
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
                <SelectTrigger>
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
            <div>
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
          </div>
        )}
        <DrawerFooter>
          <Button onClick={() => setOpen(false)}>Apply</Button>
          <Button variant="secondary" onClick={() => handleClearFilters()}>
            <Trash2 size={20} />
            Clear
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
