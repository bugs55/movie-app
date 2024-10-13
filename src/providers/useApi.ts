import axios from "axios";
import useSWR from "swr";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useApiConfig() {
  const { data, error, isLoading } = useSWR("/api/config", fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

export function useApi(api: string) {
  const { data, error, isLoading } = useSWR(api, fetcher);

  return {
    data,
    isLoading,
    error,
  };
}
