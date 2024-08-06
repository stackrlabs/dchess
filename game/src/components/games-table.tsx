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
import { formatHash } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export const GameTable = () => {
  const { submit } = useAction();
  const { data } = useSWR("games", () => getGames());
  const { ready, user } = usePrivy();
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
    const { w, b, gameId, startedAt, endedAt } = game;
    if (!user) {
      return <Button onClick={() => handleViewGame(gameId)}>Watch</Button>;
    }

    if (w === walletAddress || b === walletAddress) {
      return <Button onClick={() => handleViewGame(gameId)}>Continue</Button>;
    }
    return (
      <div className="flex gap-2">
        {!startedAt && !endedAt && (
          <Button onClick={() => handleJoinGame(gameId)}>Join</Button>
        )}
        {!endedAt && (
          <Button onClick={() => handleViewGame(gameId)}>Watch</Button>
        )}
      </div>
    );
  };

  return (
    <>
      <h3 className="text-2xl font-bold">Games</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Game</TableHead>
            <TableHead>Player 1</TableHead>
            <TableHead>Player 2</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        {!!data?.length && (
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
        )}
      </Table>
    </>
  );
};
