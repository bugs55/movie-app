"use client";

import { Button } from "@/components/ui/button";
import { GetMovieDetails, WatchProviders } from "@/types/getMovieDetails.type";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import type { ConfigUrlType } from "@/types/ConfigType.type";

type MoviePageParams = { params: { id: string } };

export default function MoviePage({ params }: MoviePageParams) {
  const { id } = params;

  const fetcher = (url: string) =>
    axios.post(url, { id }).then((res) => res.data);
  const { data, isLoading, error } = useSWR<
    GetMovieDetails & ConfigUrlType & { watch_providers: WatchProviders }
  >("/api/getMovieDetails", fetcher);

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
