import { createConfig } from "@privy-io/wagmi";
import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";

export function getConfig() {
  return createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  });
}

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
