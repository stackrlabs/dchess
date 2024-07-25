import { ActionSchema } from "@stackr/sdk";
import { Wallet } from "ethers";
import { stackrConfig } from "../stackr.config";

const { domain, operator } = stackrConfig;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const signByOperator = async (schema: ActionSchema, payload: any) => {
  const wallet = new Wallet(operator.accounts[0].privateKey);
  const signature = await wallet.signTypedData(
    domain,
    schema.EIP712TypedData.types,
    payload
  );
  return { msgSender: wallet.address, signature };
};

const prettyTurnName = (turn: string) => {
  return turn === "w" ? "White" : "Black";
};

export { prettyTurnName, signByOperator, sleep };
