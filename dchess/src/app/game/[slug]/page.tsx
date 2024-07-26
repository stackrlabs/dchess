"use client";
import { getGame } from "@/api/api";
import { useAction } from "@/api/useAction";
import { formatAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { Chess, Move } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import useSWR from "swr";

interface GameProps {
  params: {
    slug: string;
  };
}

export default function Game(props: GameProps) {
  const { params } = props;
  const { slug } = params;
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data, isLoading, error } = useSWR(
    `games/${slug}`,
    () => getGame(slug),
    {
      refreshInterval: 2000,
    }
  );
  const { submit } = useAction();
  const [game, setGame] = useState(new Chess().fen());

  useEffect(() => {
    if (data) {
      setGame(data.board);
    }
  }, [data]);

  function makeAMove(move: Move | string) {
    const board = new Chess(game);
    const result = board.move(move);
    setGame(board.fen());
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (walletAddress !== data?.w && walletAddress !== data?.b) {
      return false;
    }

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    } as Move);

    // illegal move
    if (move === null) {
      return false;
    }

    submit("move", { gameId: slug, move: move.san });
    return true;
  }

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex justify-center mt-6 self-center flex-col gap-4">
      <div className="flex flex-col justify-between">
        <p>
          <b>Game ID:</b> <span className="font-mono">{slug}</span>
        </p>
        <p>
          <b>P1 (w):</b>{" "}
          <span className="font-mono">
            {walletAddress === data.w ? "You" : formatAddress(data.w)}
          </span>
        </p>
        <p>
          <b>P2 (b):</b>{" "}
          <span className="font-mono">
            {walletAddress === data.b ? "You" : formatAddress(data.b)}
          </span>
        </p>
        <p>
          <b>Turn:</b> {game.split(" ")[1] === "w" ? "White" : "Black"}
        </p>
      </div>
      <Chessboard boardWidth={600} position={game} onPieceDrop={onDrop} />
    </div>
  );
}
