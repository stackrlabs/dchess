import { ActionSchema, SolidityType } from "@stackr/sdk";

const moveSchema = new ActionSchema("move", {
  move: SolidityType.STRING,
});

export { moveSchema };
