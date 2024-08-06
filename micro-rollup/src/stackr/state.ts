import { State } from "@stackr/sdk/machine";
import { Chess } from "chess.js";
import { BytesLike, solidityPackedKeccak256 } from "ethers";

interface RawState {
  games: {
    gameId: string;
    w: string;
    b: string;
    createdAt: number;
    startedAt: number;
    endedAt: number;
    status: "in_play" | "draw" | "w" | "b";
    boardFen: string;
  }[];
}

type WrappedGame = {
  w: string;
  b: string;
  createdAt: number;
  startedAt: number;
  endedAt: number;
  status: "in_play" | "draw" | "w" | "b";
  board: Chess;
};

interface AppState {
  games: Record<string, WrappedGame>;
}

export class ChessState extends State<RawState, AppState> {
  constructor(state: RawState) {
    super(state);
  }

  transformer() {
    return {
      wrap: () => {
        const games = this.state.games.reduce((acc, game) => {
          const { boardFen, gameId, ...rest } = game;
          const board = new Chess(boardFen);
          acc[gameId] = {
            ...rest,
            board,
          };
          return acc;
        }, {} as Record<string, WrappedGame>);
        return { games };
      },
      unwrap: (wrappedState: AppState) => {
        const games = Object.entries(wrappedState.games).map(
          ([gameId, game]) => ({
            gameId,
            w: game.w,
            b: game.b,
            startedAt: game.startedAt,
            createdAt: game.createdAt,
            endedAt: game.endedAt,
            status: game.status,
            boardFen: game.board.fen(),
          })
        );
        return { games };
      },
    };
  }

  getRootHash(): BytesLike {
    return solidityPackedKeccak256(
      ["string"],
      [JSON.stringify(this.state.games)]
    );
  }
}
