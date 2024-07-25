"use client";
import { Chess, Move } from "chess.js";
import { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function Game(props: { id: string }) {
  const [game, setGame] = useState(new Chess().fen());

  function makeAMove(move: Move | string) {
    const board = new Chess(game);
    const result = board.move(move);
    setGame(board.fen());
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    } as Move);

    // illegal move
    if (move === null) {
      return false;
    }
    return true;
  }

  return <Chessboard position={game} onPieceDrop={onDrop} />;
}
