"use client";
import { GameStatus, getGame } from "@/api/api";
import { useAction } from "@/api/useAction";
import { useAddress } from "@/hooks/useAddress";
import { ZeroAddress } from "@/lib/constants";
import { formatAddress, formatHash } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { Chess, Move } from "chess.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import useSWR from "swr";
import useSound from "use-sound";

interface GameProps {
  params: {
    slug: string;
  };
}

export default function Game(props: GameProps) {
  const { params } = props;
  const { slug } = params;
  const { walletAddress, renderString } = useAddress();
  const { ready } = usePrivy();
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

  const [selfMove] = useSound("../../../sounds/move-self.mp3");
  const [capture] = useSound("../../../sounds/capture.mp3");
  const [check] = useSound("../../../sounds/move-check.mp3");
  const [notify] = useSound("../../../sounds/notify.mp3");
  const [promote] = useSound("../../../sounds/promote.mp3");

  useEffect(() => {
    if (data) {
      setGame(data.board);
    }
  }, [data]);

  const playSound = (board: Chess) => {
    if (board.isGameOver()) {
      return notify();
    }

    if (board.isCheck()) {
      return check();
    }

    // if piece is captured
    if (board.history().length > 0) {
      const lastMove = board.history({ verbose: true })[
        board.history().length - 1
      ];
      if (lastMove.captured) {
        return capture();
      }
      if (lastMove.promotion) {
        return promote();
      }
    }

    selfMove();
  };

  function makeAMove(move: Move | string) {
    const board = new Chess(game);
    const result = board.move(move);
    setGame(board.fen());
    playSound(board);
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string, piece: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece.slice(-1).toLowerCase(),
    } as Move);

    // illegal move
    if (move === null) {
      return false;
    }

    submit("move", { gameId: slug, move: move.san });

    return true;
  }

  if (isLoading || !ready) {
    return <div>Loading...</div>;
  }

  if (!isLoading && error) {
    router.push("/");
    return null;
  }

  if (!data) {
    return <div>Game not found</div>;
  }

  const { w, b, startedAt, endedAt, status } = data;

  const isGuest = walletAddress !== w && walletAddress !== b;

  const currentPlayer = b === walletAddress ? "b" : "w";
  const otherPlayer = currentPlayer === "w" ? "b" : "w";

  const turn = game?.split(" ")?.[1] as "w" | "b";

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
        <p className="font-mono">{formatAddress(data[otherPlayer])}</p>
      </div>
      <Chessboard
        boardWidth={600}
        position={game}
        onPieceDrop={onDrop}
        boardOrientation={currentPlayer === "w" ? "white" : "black"}
        arePiecesDraggable={
          startedAt > 0 &&
          (w === walletAddress || walletAddress === b) &&
          w !== ZeroAddress &&
          b !== ZeroAddress &&
          walletAddress === data[turn] &&
          !new Chess(game).isGameOver()
        }
      />
      <div>
        <b>{isGuest ? "Not You again!" : "You"}</b>{" "}
        <p className="font-mono">{formatAddress(data[currentPlayer])}</p>
      </div>
    </div>
  );
}
