import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAddress } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHash(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

export function formatAddress(address: string) {
  if (isAddress(address)) {
    return formatHash(address);
  }
  return address;
}
