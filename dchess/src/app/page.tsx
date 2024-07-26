"use client";

import { GameWithId, getGames } from "@/api/api";
import { useAction } from "@/api/useAction";
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
import { formatAddress } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function Home() {
  const { submit } = useAction();
  const router = useRouter();
  const { data } = useSWR("games", () => getGames());
  const { renderString, walletAddress } = useAddress();

  const handleCreateGame = async () => {
    const { logs } = await submit("createGame", {
      color: "w",
    });
    const gameId = logs[0].value;
    router.push(`/game/${gameId}`);
  };

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

  return (
    <main className="flex min-h-screen flex-col gap-8 p-24">
      <div className="flex gap-6 items-center">
        <Button onClick={handleCreateGame}>Create Game</Button>
        {/* <JoinGame /> */}
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
                  {formatAddress(game.gameId)}
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
