import { usePrivy } from "@privy-io/react-auth";
import { submitAction } from "./api";
import { useMruInfo } from "./useMruInfo";

export const useAction = () => {
  const { user, signTypedData } = usePrivy();
  const { mruInfo } = useMruInfo();

  const submit = async (name: string, payload: any) => {
    if (!mruInfo || !user?.wallet) {
      return;
    }

    const inputs = { ...payload, timestamp: Date.now() };
    const { transitionToSchema, domain, schemas } = mruInfo;
    const msgSender = user.wallet.address;
    const path = transitionToSchema[name];
    const schema = schemas[path];
    const signature = await signTypedData({
      domain: domain as any,
      types: schema.types,
      primaryType: schema.primaryType,
      message: inputs,
    });

    return submitAction(path, {
      msgSender,
      signature,
      inputs,
    });
  };

  return { submit };
};
