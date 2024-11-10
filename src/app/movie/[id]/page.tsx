// import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { GetMovieDetails, WatchProviders } from "@/types/getMovieDetails.type";
import axios from "axios";
// import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import useSWR from "swr";
import type { ConfigUrlType, ConfigType } from "@/types/ConfigType.type";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CreditsResponse } from "@/types/CreditsType.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Button = dynamic(() =>
  import("@/components/ui/button").then((m) => m.Button)
);
const ArrowLeft = dynamic(() =>
  import("lucide-react").then((m) => m.ArrowLeft)
);
const Star = dynamic(() => import("lucide-react").then((m) => m.Star));
const Users = dynamic(() => import("lucide-react").then((m) => m.Users));
const Rocket = dynamic(() => import("lucide-react").then((m) => m.Rocket));
const User = dynamic(() => import("lucide-react").then((m) => m.User));

type MoviePageParams = { params: Promise<{ id: string }> };
type GetMovieDetailsResponse = GetMovieDetails &
  ConfigUrlType & {
    watch_providers: WatchProviders["results"];
    credits: CreditsResponse;
  };

async function getMovieDetails(id: string): Promise<GetMovieDetailsResponse> {
  const auth = `Bearer ${process.env.API_TOKEN}`;
  const data = await axios
    .get<GetMovieDetails>(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: auth },
    })
    .then((res) => res.data);

  const config = await axios
    .get<ConfigType>("https://api.themoviedb.org/3/configuration", {
      headers: { Authorization: auth },
    })
    .then((res) => ({
      secure_base_url: res.data.images.secure_base_url,
      base_url: res.data.images.base_url,
    }));

  const watchProviders = await axios
    .get<WatchProviders>(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
      {
        headers: { Authorization: auth },
      }
    )
    .then((res) => res.data);

  const credits = await axios
    .get<CreditsResponse>(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: { Authorization: auth },
    })
    .then((res) => res.data);

  return {
    ...data,
    ...config,
    watch_providers: watchProviders.results,
    credits,
  };
}

export default async function MoviePage({ params }: MoviePageParams) {
  const id = (await params).id;
  let data: GetMovieDetailsResponse | undefined;

  try {
    const res = await getMovieDetails(id);
    data = res;
  } catch (err) {
    console.error("getMovieDetails failed", err);
    notFound();
  }

  function getYear(date: string) {
    return date.split("-")[0];
  }

  return (
    <div className="px-5">
      <Link href="/">
        <Button variant="ghost" size="sm" className="">
          <ArrowLeft size={20} />
          Back to home
        </Button>
      </Link>
      <div className="mt-5 relative w-full">
        <div className="overflow-hidden aspect-video relative">
          {data && data.backdrop_path ? (
            <Image
              src={`${data.secure_base_url}w1280${data.backdrop_path}`}
              width={1280}
              height={720}
              alt={data.title}
              className="rounded-md object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-neutral-700 rounded-md"></div>
          )}
          <div className="absolute p-5 top-0 left-0 w-full h-full bg-gradient-to-t from-black/70">
            <div className="flex flex-col justify-end h-full">
              <div className="md:text-5xl text-2xl font-bold h-fit sm:block hidden">
                {data.title}
              </div>
              <div className="max-w-[700px] md:mt-4 mt-2 text-neutral-300 sm:block hidden">
                {data.overview}
              </div>
              <div className="flex items-center gap-2">
                <div className="mt-3 w-fit px-3 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
                  <Star color="#FFDE4D" size={20} />
                  <div className="text-base font-semibold">
                    {data.vote_average.toFixed(2)}
                  </div>
                </div>
                <div className="mt-3 w-fit px-3 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
                  <Users color="#FFDE4D" size={20} />
                  <div className="text-base font-semibold">
                    {data.vote_count}
                  </div>
                </div>
                <div className="mt-3 w-fit px-3 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
                  <Rocket color="#FFDE4D" size={20} />
                  <div className="text-base font-semibold">
                    {getYear(data.release_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="md:text-5xl text-2xl font-bold h-fit sm:hidden block">
            {data.title}
          </div>
          <div className="md:mt-4 mt-2 text-neutral-300 sm:hidden block">
            {data.overview}
          </div>
          {data.genres ? (
            <div className="mt-3">
              <div className="text-lg font-bold">Genres</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.genres.map((genre) => (
                  <Badge className="text-sm" key={genre.id}>
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {data.runtime ? (
            <div className="mt-3">
              <div className="text-lg font-bold">Runtime</div>
              <div className="flex flex-wrap gap-2">
                {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
              </div>
            </div>
          ) : null}
          {data.spoken_languages ? (
            <div className="mt-3">
              <div className="text-lg font-bold">Spoken languages</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.spoken_languages.map((language) => (
                  <Badge className="text-sm" key={language.english_name}>
                    {language.english_name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {data.production_countries ? (
            <div className="mt-3">
              <div className="text-lg font-bold">Production countries</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.production_countries.map((country) => (
                  <Badge className="text-sm" key={country.name}>
                    {country.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {data.credits.cast && data ? (
            <div className="mt-3">
              <div className="text-lg font-bold">Cast</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {/* {data.credits.cast.map((cast) => (
                  <div key={cast.id} className="flex flex-col items-center">
                    {cast.profile_path ? (
                      <Image
                        src={`${data.secure_base_url}w500${cast.profile_path}`}
                        alt={cast.name}
                        width={500}
                        height={500}
                        className="rounded-full w-20 h-20 object-cover"
                      />
                    ) : (
                      <div className="rounded-full flex items-center justify-center w-20 h-20 bg-neutral-700">
                        <User size={55} className="text-neutral-400" />
                      </div>
                    )}
                    <div className="text-sm">{cast.name}</div>
                    <div className="text-xs text-neutral-400">
                      {cast.character}
                    </div>
                  </div>
                ))} */}
              </div>
              <Carousel>
                <CarouselContent>
                  {data.credits.cast.map((cast) => (
                    <CarouselItem
                      key={cast.id}
                      className="xl:basis-1/12 lg:basis-1/6 sm:basis-1/4 basis-1/3"
                    >
                      <div className="flex flex-col items-center">
                        {cast.profile_path ? (
                          <Image
                            src={`${data.secure_base_url}w500${cast.profile_path}`}
                            alt={cast.name}
                            width={500}
                            height={500}
                            className="rounded-full w-20 h-20 object-cover"
                          />
                        ) : (
                          <div className="rounded-full flex items-center justify-center w-20 h-20 bg-neutral-700">
                            <User size={55} className="text-neutral-400" />
                          </div>
                        )}
                        <div className="text-sm text-center">{cast.name}</div>
                        <div className="text-xs text-neutral-400 text-center">
                          {cast.character}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="lg:-left-8 -left-3 backdrop-blur bg-black/40" />
                <CarouselNext className="lg:-right-8 -right-3 backdrop-blur bg-black/40" />
              </Carousel>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
