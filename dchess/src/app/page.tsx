"use client";

import { GameWithId, getGames } from "@/api/api";
import { useAction } from "@/api/useAction";
import { CreateGame } from "@/components/create-game";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddress } from "@/hooks/useAddress";
import { formatHash } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Home() {
  const { submit } = useAction();
  const { data } = useSWR("games", () => getGames());
  const { ready } = usePrivy();
  const { renderString, walletAddress } = useAddress();
  const router = useRouter();

  const handleJoinGame = async (gameId: string) => {
    await submit("joinGame", { gameId });
    router.push(`/game/${gameId}`);
  };

  const handleViewGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const renderActionForGame = (game: GameWithId) => {
    const { w, b, gameId, startedAt } = game;
    if (w === walletAddress || b === walletAddress) {
      return <Button onClick={() => handleViewGame(gameId)}>Continue</Button>;
    }
    if (startedAt) {
      return <Button onClick={() => handleViewGame(gameId)}>Watch</Button>;
    }
    return <Button onClick={() => handleJoinGame(gameId)}>Join</Button>;
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen flex-col gap-8 py-6">
        <div className="flex gap-6 items-center">Logging you in...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 py-6">
      <div className="flex gap-6 items-center">
        <CreateGame />
      </div>
      {data && data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Player 1</TableHead>
              <TableHead>Player 2</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((game) => (
              <TableRow key={game.gameId}>
                <TableCell className="font-medium font-mono">
                  {formatHash(game.gameId)}
                </TableCell>
                <TableCell className="font-mono">
                  {renderString(game.w)}
                </TableCell>
                <TableCell className="font-mono">
                  {renderString(game.b)}
                </TableCell>
                <TableCell className="text-right">
                  {renderActionForGame(game)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
