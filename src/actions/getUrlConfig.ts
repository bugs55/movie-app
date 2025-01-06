"use server";

import axios from "axios";
import type { ConfigType } from "@/types/ConfigType.type";

export async function getUrlConfig() {
  const auth = `Bearer ${process.env.API_TOKEN}`;

  try {
    const config = await axios
      .get<ConfigType>("https://api.themoviedb.org/3/configuration", {
        headers: { Authorization: auth },
      })
      .then((res) => ({
        secure_base_url: res.data.images.secure_base_url,
        base_url: res.data.images.base_url,
      }));

    return config;
  } catch (error) {
    console.error("Error fetching config:", error);
    throw new Error("Error fetching config");
  }
}
