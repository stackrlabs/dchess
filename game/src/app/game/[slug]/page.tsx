"use client";
import { GameStatus, getGame } from "@/api/api";
import { useAction } from "@/api/useAction";
import { useAddress } from "@/hooks/useAddress";
import { ZeroAddress } from "@/lib/constants";
import { boardPieces, formatAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { Chess, Move } from "chess.js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import useSWR from "swr";
import useSound from "use-sound";

interface GameProps {
  params: {
    slug: string;
  };
}

const MIN_WIDTH = 32;
export default function Game(props: GameProps) {
  const { params } = props;
  const { slug } = params;
  const { walletAddress, renderString } = useAddress();
  const { ready } = usePrivy();
  const router = useRouter();
  const {
    data: remoteGame,
    isLoading,
    error,
  } = useSWR(`games/${slug}`, () => getGame(slug), {
    refreshInterval: 2000,
  });

  const { submit } = useAction();
  const [game, setGame] = useState(new Chess());
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const [selfMove] = useSound("../../../sounds/move-self.mp3");
  const [capture] = useSound("../../../sounds/capture.mp3");
  const [check] = useSound("../../../sounds/move-check.mp3");
  const [notify] = useSound("../../../sounds/notify.mp3");

  const playSound = useCallback(
    (board: Chess, oldBoard: Chess) => {
      if (board.isGameOver()) {
        return notify();
      }

      if (board.isCheck()) {
        return check();
      }

      if (boardPieces(oldBoard) !== boardPieces(board)) {
        return capture();
      }

      selfMove();
    },
    [capture, check, notify, selfMove]
  );

  const numberOfMoves = (board: Chess) => {
    const fullMoves = Number(board.fen().split(" ")[5]) - 1;
    return fullMoves * 2 + Number(board.turn() === "b");
  };

  const updateBoard = useCallback(
    (board: Chess, oldBoard: Chess) => {
      setGame(board);
      if (isFirstLoad) {
        setIsFirstLoad(false);
      } else {
        playSound(board, oldBoard);
      }
    },
    [playSound]
  );

  useEffect(() => {
    if (!remoteGame) {
      return;
    }

    const remoteBoard = new Chess(remoteGame.board);
    if (numberOfMoves(remoteBoard) > numberOfMoves(game)) {
      updateBoard(remoteBoard, game);
    }
  }, [remoteGame, game, updateBoard]);

  const makeAMove = (move: Move | string) => {
    const board = new Chess(game.fen());
    const res = board.move(move);
    updateBoard(board, game);
    return res;
  };

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

  if (!remoteGame) {
    return <div>Game not found</div>;
  }

  const { w, b, startedAt, endedAt, status } = remoteGame;

  const isGuest = walletAddress !== w && walletAddress !== b;

  const currentPlayer = b === walletAddress ? "b" : "w";
  const otherPlayer = currentPlayer === "w" ? "b" : "w";

  const turn = game?.fen().split(" ")?.[1] as "w" | "b";

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

  const width = Math.min(
    ref.current?.clientWidth || MIN_WIDTH * 2,
    ref.current?.clientHeight || MIN_WIDTH * 2
  );

  return (
    <div className="flex flex-1 w-full justify-center mt-6 self-center flex-col gap-4">
      <div className="flex flex-col justify-between">
        <div className="flex gap-20 text-lg">
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
        <p className="font-mono">{formatAddress(remoteGame[otherPlayer])}</p>
      </div>
      <div ref={ref} className="flex-1 w-full content-center">
        <Chessboard
          id={slug}
          boardWidth={width}
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={currentPlayer === "w" ? "white" : "black"}
          arePiecesDraggable={
            startedAt > 0 &&
            (w === walletAddress || walletAddress === b) &&
            w !== ZeroAddress &&
            b !== ZeroAddress &&
            walletAddress === remoteGame[turn] &&
            !game.isGameOver()
          }
        />
      </div>
      <div>
        <b>{isGuest ? "Not You again!" : "You"}</b>{" "}
        <p className="font-mono">{formatAddress(remoteGame[currentPlayer])}</p>
      </div>
    </div>
  );
}
