import { Hook, Hooks, STF, Transitions } from "@stackr/sdk/machine";
import { Chess } from "chess.js";
import { hashMessage, ZeroAddress } from "ethers";
import { ChessState } from "./state";

type StartGameInput = { color: "w" | "b" };
type JoinGameInput = { gameId: string };
type MoveInput = { gameId: string; move: string };

const createGame: STF<ChessState, StartGameInput> = {
  handler: ({ state, inputs, msgSender, block, emit }) => {
    const gameId = hashMessage(
      `${msgSender}::${block.timestamp}::${Object.keys(state.games).length}`
    );

    const { color } = inputs;
    if (color !== "w" && color !== "b") {
      throw new Error("Invalid color");
    }
    const w = color === "w" ? msgSender : ZeroAddress;
    const b = color === "b" ? msgSender : ZeroAddress;

    state.games[gameId] = {
      w: String(w),
      b: String(b),
      createdAt: block.timestamp,
      startedAt: 0,
      endedAt: 0,
      status: "in_play",
      board: new Chess(),
    };

    emit({
      name: "GameCreated",
      value: gameId,
    });

    return state;
  },
};

const joinGame: STF<ChessState, JoinGameInput> = {
  handler: ({ state, inputs, msgSender, block }) => {
    const { gameId } = inputs;
    const game = state.games[gameId];
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.w !== ZeroAddress && game.b !== ZeroAddress) {
      throw new Error("Game already has two players");
    }

    if (game.w === String(msgSender) || game.b === String(msgSender)) {
      throw new Error("Player already in game");
    }

    const newPlayer = game.w === ZeroAddress ? "w" : "b";

    game[newPlayer] = String(msgSender);
    game.startedAt = block.timestamp;

    return state;
  },
};

const move: STF<ChessState, MoveInput> = {
  handler: ({ state, inputs, msgSender, emit }) => {
    const { gameId, move } = inputs;
    const game = state.games[gameId];
    if (!game) {
      throw new Error("Game not found");
    }
    if (msgSender !== game.w && msgSender !== game.b) {
      throw new Error("Player not in game");
    }

    if (msgSender !== game[game.board.turn()]) {
      throw new Error("Not your turn");
    }

    if (game.startedAt === 0) {
      throw new Error("Game not started");
    }

    if (game.endedAt !== 0) {
      throw new Error("Game ended");
    }

    const gameBoard = game.board;
    if (!gameBoard.move(move)) {
      throw new Error("Invalid move");
    }

    if (gameBoard.isGameOver()) {
      game.endedAt = Date.now();
      if (gameBoard.isCheckmate()) {
        game.status = gameBoard.turn() === "w" ? "b" : "w";
      } else {
        game.status = "draw";
      }

      emit({
        name: "GameEnded",
        value: game.status,
      });
    }

    return state;
  },
};

const PRUNE_GAMES_INTERVAL = 300_000;
const pruneGames: Hook<ChessState> = {
  handler: ({ state, block }) => {
    const { games } = state;
    for (const [gameId, game] of Object.entries(games)) {
      if (
        game.startedAt === 0 &&
        block.timestamp - game.createdAt > PRUNE_GAMES_INTERVAL
      ) {
        delete games[gameId];
      }
    }
    return state;
  },
};

const transitions: Transitions<ChessState> = {
  createGame,
  joinGame,
  move,
};

const hooks: Hooks<ChessState> = {
  pruneGames,
};

export { hooks, transitions };
