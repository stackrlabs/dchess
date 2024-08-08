"use client";
import { GameStatus, getGame } from "@/api/api";
import { useAction } from "@/api/useAction";
import { GameActions } from "@/components/game-actions/game-actions";
import { useAddress } from "@/hooks/useAddress";
import { ZeroAddress } from "@/lib/constants";
import { boardInfo, formatAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { Chess, Move } from "chess.js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

  const [selfMove] = useSound("../../../sounds/move-self.mp3");
  const [capture] = useSound("../../../sounds/capture.mp3");
  const [check] = useSound("../../../sounds/move-check.mp3");
  const [notify] = useSound("../../../sounds/notify.mp3");
  const [promote] = useSound("../../../sounds/promote.mp3");

  const playSound = useCallback(
    (board: Chess, oldBoard: Chess) => {
      if (board.isGameOver()) {
        return notify();
      }

      if (board.isCheck()) {
        return check();
      }

      const { sortedPieces: oldPieces, pawnsCount: oldPawns } =
        boardInfo(oldBoard);
      const { sortedPieces: newPieces, pawnsCount: newPawns } =
        boardInfo(board);

      if (oldPieces.length !== newPieces.length) {
        return capture();
      }

      if (oldPawns !== newPawns) {
        return promote();
      }

      selfMove();
    },
    [capture, check, notify, promote, selfMove]
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
    [playSound, isFirstLoad]
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

  return (
    <div className="flex mt-8">
      <div className="flex flex-1 flex-col w-full gap-4">
        <div>
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
        <div>
          <Chessboard
            id={slug}
            boardWidth={450}
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
          <p className="font-mono">
            {formatAddress(remoteGame[currentPlayer])}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col w-full gap-4">
        <h1 className="text-2xl">Actions</h1>
        <GameActions slug={slug} />
      </div>
    </div>
  );
}
