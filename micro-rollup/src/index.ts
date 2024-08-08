import {
  ActionConfirmationStatus,
  ActionExecutionStatus,
  ActionSchema,
  MicroRollup,
} from "@stackr/sdk";
import express, { Request, Response } from "express";

import { stackrConfig } from "../stackr.config.ts";
import * as schemas from "./stackr/actions.ts";
import { chessStateMachine } from "./stackr/chess.machine.ts";
import { transitions } from "./stackr/transitions.ts";

const { createGameSchema, joinGameSchema, moveSchema } = schemas;
const stfSchemaMap: Record<string, ActionSchema> = {
  createGame: createGameSchema,
  joinGame: joinGameSchema,
  move: moveSchema,
};

async function main() {
  const mru = await MicroRollup({
    config: stackrConfig,
    actionSchemas: [moveSchema, createGameSchema, joinGameSchema],
    stateMachines: [chessStateMachine],
    blockHooks: {
      post: ["pruneGames"],
    },
    stfSchemaMap,
  });

  await mru.init();

  const app = express();
  app.use(express.json());
  // allow CORS
  app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  const machine = mru.stateMachines.getFirst<typeof chessStateMachine>();

  /** Routes */
  app.get("/info", (_req: Request, res: Response) => {
    const transitionToSchema = mru.getStfSchemaMap();
    res.send({
      signingInstructions: "signTypedData(domain, schema.types, inputs)",
      domain: mru.config.domain,
      transitionToSchema,
      schemas: Object.values(schemas).reduce((acc, schema) => {
        acc[schema.identifier] = {
          primaryType: schema.EIP712TypedData.primaryType,
          types: schema.EIP712TypedData.types,
        };
        return acc;
      }, {} as Record<string, any>),
    });
  });

  app.post("/:reducerName", async (req: Request, res: Response) => {
    const { reducerName } = req.params;
    const actionReducer = transitions[reducerName];

    if (!actionReducer) {
      res.status(400).send({ message: "NO_REDUCER_FOR_ACTION" });
      return;
    }

    try {
      const { msgSender, signature, inputs } = req.body;

      const actionSchema = stfSchemaMap[reducerName];
      const signedAction = actionSchema.actionFrom({
        msgSender,
        signature,
        inputs,
      });
      const ack = await mru.submitAction(reducerName, signedAction);
      const { errors, logs } = await ack.waitFor(ActionConfirmationStatus.C1);
      if (errors?.length) {
        throw new Error(errors[0].message);
      }
      res.status(201).send({ logs });
    } catch (e: any) {
      res.status(400).send({ error: e.message });
    }
    return;
  });

  app.get("/games/:gameId", async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { wrappedState } = machine;
    const game = wrappedState.games[gameId];
    if (!game) {
      res.status(404).send({ message: "GAME_NOT_FOUND" });
      return;
    }

    const { board, ...rest } = game;
    return res.send({ ...rest, board: board.fen() });
  });

  app.get("/games/:gameId/actions", async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { wrappedState } = machine;
    const game = wrappedState.games[gameId];
    if (!game) {
      res.status(404).send({ message: "GAME_NOT_FOUND" });
      return;
    }

    const actionsAndBlocks = await mru.actions.query(
      {
        executionStatus: ActionExecutionStatus.ACCEPTED,
        block: {
          isReverted: false,
        },
      },
      false
    );

    const gameActions = actionsAndBlocks.filter((actionAndBlock) => {
      if (actionAndBlock.name === "createGame") {
        return actionAndBlock.logs?.[0]?.value === gameId;
      }
      return actionAndBlock.payload.gameId === gameId;
    });

    const actions = gameActions.map((actionAndBlock) => {
      const { name, payload, hash, msgSender, block } = actionAndBlock;

      return {
        name,
        payload,
        hash,
        msgSender,
        blockInfo: block
          ? {
              status: block.status,
              daMetadata: block.batchInfo?.daMetadata || null,
              l1TxHash: block.batchInfo?.l1TransactionHash || null,
            }
          : null,
      };
    });

    return res.send(actions);
  });

  app.get("/games", async (_req: Request, res: Response) => {
    const { games } = machine.state;

    res.json(
      games.map((game) => {
        return {
          ...game,
          board: game.boardFen,
        };
      })
    );
  });

  app.get("/", (_req: Request, res: Response) => {
    res.json(machine.state);
  });

  app.listen(3012, () => {
    console.log("Server running on port 3012");
  });
}

main();
