import { ActionSchema, SolidityType } from "@stackr/sdk";

const moveSchema = new ActionSchema("move", {
  gameId: SolidityType.STRING,
  move: SolidityType.STRING,
});

const createGameSchema = new ActionSchema("createGame", {
  color: SolidityType.STRING,
});

const joinGameSchema = new ActionSchema("joinGame", {
  gameId: SolidityType.STRING,
});

export { moveSchema, createGameSchema, joinGameSchema };
