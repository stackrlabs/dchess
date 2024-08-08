"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useState } from "react";
import { sepolia } from "viem/chains";
import { getConfig } from "../config";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  const { resolvedTheme } = useTheme();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: resolvedTheme === "dark" ? "dark" : "light",
          accentColor: "#676FFF",
          logo: "https://dchess.stf.xyz/icon.png",
        },
        externalWallets: {
          coinbaseWallet: {
            connectionOptions: "all",
          },
        },
        embeddedWallets: {
          createOnLogin: "all-users",
        },
        defaultChain: sepolia,
        supportedChains: [sepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
