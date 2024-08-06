"use client";

import useSWR from "swr";
import { getInfo } from "./api";

export const useMruInfo = () => {
  const { data: mruInfo, isLoading } = useSWR("/mru-info", getInfo, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });
  return { mruInfo, isLoading };
};
