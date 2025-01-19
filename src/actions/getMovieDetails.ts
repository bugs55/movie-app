"use server";

import { GetMovieDetails, WatchProviders } from "@/types/getMovieDetails.type";
import axios from "axios";
import type { ConfigUrlType, ConfigType } from "@/types/ConfigType.type";
import { CreditsResponse } from "@/types/CreditsType.type";

type GetMovieDetailsResponse = GetMovieDetails &
  ConfigUrlType & {
    watch_providers: WatchProviders["results"];
    credits: CreditsResponse;
  };

export async function getMovieDetails(
  id: string
): Promise<GetMovieDetailsResponse> {
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
