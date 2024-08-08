"use client";

import { CreateGame } from "@/components/create-game";
import { GameTable } from "@/components/games-table";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <main className="flex flex-1 min-h-screen flex-col gap-8 py-6 w-full m-auto">
      <div className="flex gap-6 items-center">
        {authenticated ? (
          <CreateGame />
        ) : (
          <Button disabled={disableLogin} onClick={login}>
            Connect Wallet to Play
          </Button>
        )}
      </div>
      <GameTable />
    </main>
  );
}
