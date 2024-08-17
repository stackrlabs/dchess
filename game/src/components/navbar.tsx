"use client";
import { formatHash } from "@/lib/utils";
import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { user, logout } = usePrivy();
  const walletAddress = (user?.linkedAccounts as WalletWithMetadata[])?.find(
    (a) => a.connectorType !== "embedded"
  )?.address;

  // const { resolvedTheme } = useTheme();
  // const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="flex justify-between flex-wrap p-6 px-4 m-auto w-full lg:w-[1500px]">
      <Link
        href={"/"}
        className="text-4xl font-bold select-none cursor-pointer"
      >
        <Image
          src={"https://chess.stf.xyz/logo-white.svg"}
          width={150}
          height={150}
          alt="dchess-logo"
        />
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
        {/* <ThemeToggle /> */}
      </div>
    </div>
  );
};
