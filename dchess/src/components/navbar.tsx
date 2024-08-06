"use client";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { formatHash } from "@/lib/utils";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const walletAddress = user?.wallet?.address;
  return (
    <div className="flex justify-between">
      <Link
        href={"/"}
        className="text-4xl font-bold select-none cursor-pointer"
      >
        dChess
      </Link>
      <div className="flex gap-4 text-center place-items-center">
        {!!walletAddress && (
          <div className="flex gap-2 cursor-pointer">
            <p className="font-mono">{formatHash(walletAddress)}</p>
            <LogOut onClick={logout} />
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};
