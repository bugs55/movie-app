"use client";

import Image from "next/image";
import React from "react";
import { Star } from "lucide-react";
import useSWR from "swr";
import { ConfigUrlType } from "@/types/ConfigType.type";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";

type MovieCardProps = {
  img: string;
  rating: number;
  title: string;
  description: string;
};

export default function MovieCard({
  img,
  rating,
  title,
  description,
}: MovieCardProps) {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data, error, isLoading } = useSWR<ConfigUrlType>("/api/config", fetcher);

  return (
    <div>
      <div className="w-full relative">
        <div className="absolute top-3 left-3 px-4 py-2 flex items-center gap-2 backdrop-blur bg-black/40 rounded-md">
          <Star color="#FFDE4D" size={20} />
          <div className="text-base font-semibold">{rating}</div>
        </div>
      {
        isLoading ? (
          <Skeleton className="w-full h-[150px] rounded-md" />
        ) : (
          error || !data ? (
            <div className="w-full h-[150px] rounded-md bg-white/20"></div>
          ) : (
            <Image src={`${data?.secure_base_url}w342${img}`} width={342} height={300} alt={title} className="rounded-md w-full" />
          )
        )
      }
      </div>
      <div className="px-2 py-4">
        <div className="text-xl font-semibold line-clamp-2 mb-2">{title}</div>
        <div className="line-clamp-3">{description}</div>
      </div>
    </div>
  );
}
