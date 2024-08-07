import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { sepolia } from "viem/chains";

export function getConfig() {
  return createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  });
}
