import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config.ts";

import { moveSchema } from "./actions.ts";
import { chessStateMachine } from "./chess.machine.ts";

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [moveSchema],
  stateMachines: [chessStateMachine],
});

await mru.init();

export { mru };
