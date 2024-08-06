"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://images.chesscomfiles.com/uploads/v1/article/16910.21d3fdbc.668x375o.934ab09b0f7d@2x.jpeg",
        },
        embeddedWallets: {
          createOnLogin: "all-users",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
