import { StateMachine } from "@stackr/sdk/machine";
import { state as initialState } from "../../genesis-state.json";
import { ChessState } from "./state";
import { transitions } from "./transitions";

const STATE_MACHINES = {
  CHESS: "chess",
};

const chessStateMachine = new StateMachine({
  id: STATE_MACHINES.CHESS,
  initialState,
  stateClass: ChessState,
  on: transitions,
});

export { STATE_MACHINES, chessStateMachine };
