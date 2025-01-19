import Image from "next/image";
import { Star } from "lucide-react";
import { ConfigUrlType } from "@/types/ConfigType.type";
import type { Result } from "@/types/getMovies.type";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";

type MovieCardProps = {
  movie: Result;
  secure_base_url: ConfigUrlType["secure_base_url"];
};

export default function MovieCard({ movie, secure_base_url }: MovieCardProps) {
  const { id, poster_path, vote_average, title, overview, genres } = movie;

  return (
    <div>
      <div className="w-full relative cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-2">
        <div className="absolute top-3 left-3 px-4 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
          <Star color="#FFDE4D" size={20} />
          <div className="text-base font-semibold">
            {vote_average.toFixed(2)}
          </div>
        </div>
        {!poster_path || !secure_base_url ? (
          <Link href={`/movie/${id}`}>
            <div className="w-full h-[441px] rounded-md bg-white/20"></div>
          </Link>
        ) : (
          <Link href={`/movie/${id}`}>
            <Image
              src={`${secure_base_url}w342${poster_path}`}
              width={342}
              height={300}
              alt={title}
              className="rounded-md w-full"
            />
          </Link>
        )}
      </div>
      <div className="px-2 py-4">
        <div className="sm:text-xl text-lg font-semibold line-clamp-2 mb-2">
          {title}
        </div>
        <div className="sm:line-clamp-3 line-clamp-4 sm:text-base text-sm">
          {overview}
        </div>
        {genres ? (
          <div className="flex items-center flex-wrap gap-2 mt-3">
            {genres.map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
          </div>
        ) : null}
        <Link href={`/movie/${id}`}>
          <Button className="w-full mt-6">Details</Button>
        </Link>
      </div>
    </div>
  );
}
