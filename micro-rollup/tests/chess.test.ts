import {
  ConfirmationEvents,
  MicroRollup,
  MicroRollupResponse,
} from "@stackr/sdk";
import { StateMachine } from "@stackr/sdk/machine";
import { expect } from "chai";
import { Chess } from "chess.js";
import genesisState from "../genesis-state.json";
import { moveSchema } from "../src/stackr/actions.ts";
import { chessStateMachine } from "../src/stackr/chess.machine.ts";
import { transitions } from "../src/stackr/transitions.ts";
import { ChessState } from "../src/stackr/state.ts";
import { signByOperator, sleep } from "../src/utils.ts";
import { stackrConfig } from "../stackr.config.ts";

describe("Chess MRU", async () => {
  let mru: MicroRollupResponse;

  const machine = new StateMachine({
    id: "chess",
    initialState: genesisState.state,
    stateClass: ChessState,
    on: transitions,
  });

  beforeEach(async () => {
    mru = await MicroRollup({
      isSandbox: true,
      config: {
        ...stackrConfig,
        sequencer: {
          batchSize: 1,
          batchTime: 1,
        },
        logLevel: "error",
      },
      actionSchemas: [moveSchema],
      stateMachines: [machine],
    });

    await mru.init();
  });

  describe("Pick and execute a move", async () => {
    it("should pick and execute a move", async () => {
      const chessMachine =
        mru.stateMachines.get<typeof chessStateMachine>("chess");
      if (!chessMachine) {
        throw new Error("Chess machine not found");
      }

      const moves = chessMachine.wrappedState.moves();
      const move = moves[0];

      const inputs = {
        move,
      };

      const waitForEvent = (eventName: any) => {
        return new Promise((resolve) => {
          mru.events.subscribe(eventName, (event) => {
            console.log(event);
            resolve(event);
          });
        });
      };

      const signInfo = await signByOperator(moveSchema, inputs);

      const ack = await mru.submitAction(
        "move",
        moveSchema.actionFrom({
          inputs,
          ...signInfo,
        })
      );

      await waitForEvent(ConfirmationEvents.C1);
      await sleep(1000);

      const replicaBoard = new Chess();
      replicaBoard.move(move);

      expect(chessMachine.wrappedState.turn()).to.equal(replicaBoard.turn());

      expect(chessMachine.state).to.equal(replicaBoard.fen());
    });
  });

  afterEach(async () => {
    await mru.shutdown();
  });
});
