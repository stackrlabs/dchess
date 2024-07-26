"use client";
import { getGame } from "@/api/api";
import { useAction } from "@/api/useAction";
import { useAddress } from "@/hooks/useAddress";
import { ZeroAddress } from "@/lib/constants";
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
  const { walletAddress, renderString } = useAddress();
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

  if (isLoading || !data || !walletAddress) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { w, b, startedAt } = data;

  return (
    <div className="flex justify-center mt-6 self-center flex-col gap-4">
      <div className="flex flex-col justify-between">
        <p>
          <b>Game ID:</b> <span className="font-mono">{slug}</span>
        </p>
        <p>
          <b>P1 (w):</b> <span className="font-mono">{renderString(w)}</span>
        </p>
        <p>
          <b>P2 (b):</b> <span className="font-mono">{renderString(b)}</span>
        </p>
        <p>
          <b>Turn:</b> {game.split(" ")[1] === "w" ? "White" : "Black"}
        </p>
      </div>
      <Chessboard
        boardWidth={600}
        position={game}
        onPieceDrop={onDrop}
        boardOrientation={b === walletAddress ? "black" : "white"}
        arePiecesDraggable={
          startedAt > 0 &&
          (w === walletAddress || walletAddress === b) &&
          w !== ZeroAddress &&
          b !== ZeroAddress
        }
      />
    </div>
  );
}
