"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieIcon from "@/icons/MovieIcon";
import { useState } from "react";
import Searchbox from "./Searchbox";

export default function Header() {
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  return (
    <div className="px-5 w-full h-[80px] font-semibold text-movie-orange text-3xl flex items-center justify-between gap-4">
      <Link href={"/"}>
        <div className="flex gap-4 items-center whitespace-nowrap">
          <MovieIcon fontSize={35} />
          Movie Database
        </div>
      </Link>
      <div className="w-[300px]">
        <Button
          variant="outline"
          size="sm"
          className="flex justify-start w-full"
          onClick={() => setOpenSearch(true)}
        >
          <Search size={20} />
          Search movie
        </Button>
      </div>
      <Searchbox open={openSearch} setOpen={setOpenSearch} />
    </div>
  );
}
