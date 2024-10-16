"use client";

import Image from "next/image";
import React from "react";
import { Star } from "lucide-react";
import useSWR from "swr";

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
  const { data, error, isLoading } = useSWR("/api/config");

  return (
    <div>
      <div className="w-full relative">
        <div className="absolute top-3 left-3 px-2 py-4 flex items-center gap-1 backdrop-blur bg-black/20 rounded-sm">
          <Star color="#FFDE4D" />
          <div>{rating}</div>
        </div>
        <Image src={img} alt={title} className="rounded-md" />
      </div>
      <div className="px-2 py-4">
        <div className="text-lg font-semibold line-clamp-2">{title}</div>
        <div className="line-clamp-5">{description}</div>
      </div>
    </div>
  );
}
