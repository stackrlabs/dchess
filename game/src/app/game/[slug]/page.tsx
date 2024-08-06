"use client";
import { GameStatus, getGame } from "@/api/api";
import { useAction } from "@/api/useAction";
import { useAddress } from "@/hooks/useAddress";
import { ZeroAddress } from "@/lib/constants";
import { formatHash } from "@/lib/utils";
import { Chess, Move } from "chess.js";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  if (isLoading || !walletAddress) {
    return <div>Loading...</div>;
  }

  if (!isLoading || error) {
    router.push("/");
    return null;
  }

  if (!data) {
    return <div>Game not found</div>;
  }

  const { w, b, startedAt, endedAt, status } = data;

  const currentPlayer = b === walletAddress ? "b" : "w";
  const otherPlayer = currentPlayer === "w" ? "b" : "w";

  const getGameStatus = (status: GameStatus) => {
    if (status === "in_play") {
      return "";
    }
    if (status === "draw") {
      return "Draw";
    }
    if (status === "w") {
      return `${renderString(w)} (w) won`;
    }
    if (status === "b") {
      return `${renderString(b)} (b) won`;
    }
  };

  const turn = game?.split(" ")?.[1] as "w" | "b";

  return (
    <div className="flex justify-center mt-6 self-center flex-col gap-4">
      <div className="flex flex-col justify-between">
        <div className="flex gap-20 text-lg">
          <p>
            <b>Game ID:</b>{" "}
            <span className="font-mono">{formatHash(slug)}</span>
          </p>
          <p>
            <b>Turn:</b> {turn === "w" ? "White" : "Black"}
          </p>
          <p>
            <b>Status:</b> {endedAt > 0 ? getGameStatus(status) : "In Play"}
          </p>
        </div>
      </div>
      <div>
        <b>Not You</b>{" "}
        <p className="font-mono">{formatHash(data[otherPlayer])}</p>
      </div>
      <Chessboard
        boardWidth={600}
        position={game}
        onPieceDrop={onDrop}
        boardOrientation={currentPlayer === "w" ? "white" : "black"}
        arePiecesDraggable={
          (startedAt > 0 &&
            (w === walletAddress || walletAddress === b) &&
            w !== ZeroAddress &&
            b !== ZeroAddress &&
            walletAddress === data[turn]) ||
          !new Chess(game).isGameOver()
        }
      />
      <div>
        <b>You</b>{" "}
        <p className="font-mono">{formatHash(data[currentPlayer])}</p>
      </div>
    </div>
  );
}
