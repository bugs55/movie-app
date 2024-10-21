"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { ConfigUrlType } from "@/types/ConfigType.type";
import type { Result } from "@/types/getMovies.type";
import { Button } from "./ui/button";

type MovieCardProps = {
  movie: Result;
  secure_base_url: ConfigUrlType["secure_base_url"];
};

export default function MovieCard({ movie, secure_base_url }: MovieCardProps) {
  const { poster_path, vote_average, title, overview } = movie;

  return (
    <div>
      <div className="w-full relative">
        <div className="absolute top-3 left-3 px-4 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
          <Star color="#FFDE4D" size={20} />
          <div className="text-base font-semibold">
            {vote_average.toFixed(2)}
          </div>
        </div>
        {!poster_path || !secure_base_url ? (
          <div className="w-full h-[441px] rounded-md bg-white/20"></div>
        ) : (
          <Image
            src={`${secure_base_url}w342${poster_path}`}
            width={342}
            height={300}
            alt={title}
            className="rounded-md w-full"
          />
        )}
      </div>
      <div className="px-2 py-4">
        <div className="text-xl font-semibold line-clamp-2 mb-2">{title}</div>
        <div className="line-clamp-3">{overview}</div>
        <Button className="w-full mt-4">Details</Button>
      </div>
    </div>
  );
}
