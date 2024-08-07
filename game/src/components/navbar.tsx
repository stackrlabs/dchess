"use client";
import { formatHash } from "@/lib/utils";
import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { user, logout } = usePrivy();
  const walletAddress = (user?.linkedAccounts as WalletWithMetadata[])?.find(
    (a) => a.connectorType !== "embedded"
  )?.address;

  return (
    <div className="flex justify-between flex-wrap">
      <Link
        href={"/"}
        className="text-4xl font-bold select-none cursor-pointer"
      >
        dChess
      </Link>
      <div className="flex gap-4 place-items-center">
        {!!walletAddress && (
          <div className="flex gap-4 items-center">
            <p className="font-mono">
              <b>AA Wallet:</b> {formatHash(user?.wallet?.address || "...")}
            </p>
            <Button onClick={logout} variant="outline" size="icon">
              <LogOut />
            </Button>
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};
