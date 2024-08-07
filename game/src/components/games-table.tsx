"use client";

import { Game, GameWithId, getGames } from "@/api/api";
import { useAction } from "@/api/useAction";
import { Button } from "@/components/ui/button";
import { useAddress } from "@/hooks/useAddress";
import { formatHash } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Chessboard } from "react-chessboard";
import useSWR from "swr";

export const GameTable = () => {
  const { submit } = useAction();
  const { data } = useSWR("games", () => getGames(), {
    refreshInterval: 5000,
  });
  const { ready, user } = usePrivy();
  const { renderString, walletAddress } = useAddress();
  const router = useRouter();

  const getGameStatus = (game: Game) => {
    const { status } = game;
    if (status === "in_play") {
      return "LIVE";
    } else return "ENDED";
  };

  const getWinner = (game: Game) => {
    const { status } = game;
    if (status === "w") {
      return "P1 WON";
    }
    if (status === "b") {
      return "P2 WON";
    }
    if (status === "draw") {
      return "DRAW";
    }
  };

  const handleJoinGame = async (gameId: string) => {
    await submit("joinGame", { gameId });
    router.push(`/game/${gameId}`);
  };

  const handleViewGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const renderActionForGame = (game: GameWithId) => {
    const { w, b, gameId, startedAt, endedAt } = game;
    if (!user || !!endedAt) {
      return (
        <Button onClick={() => handleViewGame(gameId)}>
          {endedAt ? "Analyze" : "Watch"}
        </Button>
      );
    }

    if (w === walletAddress || b === walletAddress) {
      return <Button onClick={() => handleViewGame(gameId)}>Continue</Button>;
    }
    return (
      <>
        {!startedAt && !endedAt && (
          <Button onClick={() => handleJoinGame(gameId)}>Join</Button>
        )}
        {!endedAt && (
          <Button onClick={() => handleViewGame(gameId)}>Watch</Button>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-wrap gap-4 w-full justify-center">
      {data &&
        ready &&
        data.map((game) => (
          <div
            key={game.gameId}
            className="border border-gray-500 rounded-md p-6 group relative"
          >
            <div className="flex gap-4 duration-200 relative">
              <div className="absolute h-full w-full flex justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-50">
                <div className="flex gap-2">{renderActionForGame(game)}</div>
              </div>
              <div className="duration-200 z-10 group-hover:blur-sm">
                <Chessboard boardWidth={200} position={game.board} />
              </div>
              <div className="flex-1 transition-all group-hover:blur-sm">
                <div className="font-mono flex flex-col justify-between h-full">
                  <div className="">
                    <div className="flex gap-2">
                      <div
                        className={`${
                          game.status === "in_play"
                            ? "bg-green-500"
                            : "bg-red-400"
                        } px-2 w-fit text-black rounded`}
                      >
                        {getGameStatus(game)}
                      </div>
                      {getWinner(game) && (
                        <div className="bg-white px-2 w-fit text-black rounded">
                          {getWinner(game)}
                        </div>
                      )}
                    </div>
                    <div className="text-lg">{formatHash(game.gameId)}</div>
                  </div>

                  <div className="">
                    <div className="font-mono flex flex-col gap-2 text-[1rem]">
                      <div className="flex gap-2">
                        <div className="bg-white px-1 text-black rounded">
                          P1
                        </div>
                        {renderString(game.w)}
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-gray-800 px-1 text-white border border-white rounded">
                          P2
                        </div>
                        {renderString(game.b)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
