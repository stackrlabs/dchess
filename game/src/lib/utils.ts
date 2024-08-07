import { Chess } from "chess.js";
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

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function boardInfo(board: Chess) {
  const pieces = board
    .board()
    .flat()
    .filter(isDefined)
    .map((p) => p.type + p.color);

  const sortedPieces = pieces.sort().join("");
  const pawnsCount = pieces.filter((p) => p[0] === "p").length;
  return { sortedPieces, pawnsCount };
}
