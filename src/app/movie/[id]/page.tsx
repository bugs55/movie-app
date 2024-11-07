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

const Button = dynamic(() =>
  import("@/components/ui/button").then((m) => m.Button)
);
const ArrowLeft = dynamic(() =>
  import("lucide-react").then((m) => m.ArrowLeft)
);
const Star = dynamic(() => import("lucide-react").then((m) => m.Star));
const Users = dynamic(() => import("lucide-react").then((m) => m.Users));
const Rocket = dynamic(() => import("lucide-react").then((m) => m.Rocket));

type MoviePageParams = { params: Promise<{ id: string }> };
type GetMovieDetailsResponse = GetMovieDetails &
  ConfigUrlType & { watch_providers: WatchProviders["results"] };

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

  return {
    ...data,
    ...config,
    watch_providers: watchProviders.results,
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

  // const fetcher = (url: string) =>
  //   axios.post(url, { id }).then((res) => res.data);
  // const { data, isLoading, error } = useSWR<
  //   GetMovieDetails & ConfigUrlType & { watch_providers: WatchProviders }
  // >("/api/getMovieDetails", fetcher);

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
              <div className="md:text-5xl text-2xl font-bold h-fit">
                {data.title}
              </div>
              <div className="max-w-[700px] md:mt-4 mt-2 text-neutral-300">
                {data.overview}
              </div>
              <div className="flex items-center gap-4">
                <div className="mt-3 w-fit px-3 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
                  <Star color="#FFDE4D" size={20} />
                  <div className="text-base font-semibold">
                    {data.vote_average.toFixed(2)}
                  </div>
                </div>
                <div className="mt-3 w-fit px-3 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
                  <Users color="#ff7070" size={20} />
                  <div className="text-base font-semibold">
                    {data.vote_count}
                  </div>
                </div>
                <div className="mt-3 w-fit px-3 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
                  <Rocket color="#0ea5e9" size={20} />
                  <div className="text-base font-semibold">
                    {getYear(data.release_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
