import { ActionSchema, SolidityType } from "@stackr/sdk";

const moveSchema = new ActionSchema("move", {
  gameId: SolidityType.STRING,
  move: SolidityType.STRING,
  timestamp: SolidityType.UINT,
});

const createGameSchema = new ActionSchema("createGame", {
  color: SolidityType.STRING,
  timestamp: SolidityType.UINT,
});

const joinGameSchema = new ActionSchema("joinGame", {
  gameId: SolidityType.STRING,
  timestamp: SolidityType.UINT,
});

export { moveSchema, createGameSchema, joinGameSchema };
