import { Playground } from "@stackr/sdk/plugins";
import { chessStateMachine } from "./stackr/chess.machine.ts";
import { mru } from "./stackr/chess.mru.ts";

if (process.env.NODE_ENV !== "production") {
  Playground.init(mru);
}

const machine = mru.stateMachines.get<typeof chessStateMachine>("chess");
if (!machine) {
  throw new Error("Chess machine not found");
}
