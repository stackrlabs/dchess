import { Hook, Hooks, STF, Transitions } from "@stackr/sdk/machine";
import { Chess } from "chess.js";
import { ZeroAddress, solidityPackedKeccak256 } from "ethers";
import { ChessState } from "./state";

type StartGameInput = { color: "w" | "b" };
type JoinGameInput = { gameId: string };
type MoveInput = { gameId: string; move: string };

const createGame: STF<ChessState, StartGameInput> = {
  handler: ({ state, inputs, msgSender, block }) => {
    const gameId = solidityPackedKeccak256(
      ["uint256", "string"],
      [state.games.length, block.timestamp]
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
      board: new Chess(),
    };

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
    const newPlayer = game.w === ZeroAddress ? "w" : "b";

    game[newPlayer] = String(msgSender);
    game.startedAt = block.timestamp;

    return state;
  },
};

const move: STF<ChessState, MoveInput> = {
  handler: ({ state, inputs, msgSender }) => {
    const { gameId, move } = inputs;
    const game = state.games[gameId];
    if (!game) {
      throw new Error("Game not found");
    }
    if (msgSender !== game.w && msgSender !== game.b) {
      throw new Error("Player not in game");
    }
    const gameBoard = game.board;
    if (!gameBoard.move(move)) {
      throw new Error("Invalid move");
    }
    return state;
  },
};

const PRUNE_GAMES_INTERVAL = 300;
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
