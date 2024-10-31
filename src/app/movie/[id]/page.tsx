import { Button } from "@/components/ui/button";
import { GetMovieDetails, WatchProviders } from "@/types/getMovieDetails.type";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import useSWR from "swr";
import type { ConfigUrlType, ConfigType } from "@/types/ConfigType.type";
import { notFound } from "next/navigation";

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
      <div className="mt-5">
        {data ? (
          <Image
            src={`${data.secure_base_url}w1280${data?.backdrop_path}`}
            width={1280}
            height={720}
            alt={data.title}
            className="rounded-md"
          />
        ) : (
          <div className="w-[1280px] h-500px bg-neutral-700"></div>
        )}
      </div>
      <div className="md:text-3xl text-2xl font-bold mt-5 mb-2">
        {data?.title}
      </div>
    </div>
  );
}
