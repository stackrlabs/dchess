import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config.ts";

import { createGameSchema, joinGameSchema, moveSchema } from "./actions.ts";
import { chessStateMachine } from "./chess.machine.ts";

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [moveSchema, createGameSchema, joinGameSchema],
  stateMachines: [chessStateMachine],
  blockHooks: {
    post: ["pruneGames"],
  },
  stfSchemaMap: {
    createGame: createGameSchema,
    joinGame: joinGameSchema,
    move: moveSchema,
  },
});

await mru.init();

export { mru };
