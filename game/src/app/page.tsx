"use client";

import { CreateGame } from "@/components/create-game";
import { GameTable } from "@/components/games-table";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <main className="flex flex-col gap-8 m-auto w-full px-4 lg:py-0 lg:w-[1500px]">
      <div className="flex gap-6 items-center mt-0 md:mt-8">
        {authenticated ? (
          <CreateGame />
        ) : (
          <div>
            <Button
              className="font-mono uppercase"
              disabled={disableLogin}
              onClick={login}
              variant={"secondary"}
            >
              Connect Wallet to Play
            </Button>
            <p className="text-xs text-slate-300 font-mono mt-2">
              Your wallet is not used for any transactions, it will be your
              identity to access your embedded wallet, which will be used to
              sign transactions.
            </p>
          </div>
        )}
      </div>
      <GameTable />
    </main>
  );
}
