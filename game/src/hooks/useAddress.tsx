import { ZeroAddress } from "@/lib/constants";
import { formatAddress } from "@/lib/utils";
import { usePrivy, WalletWithMetadata } from "@privy-io/react-auth";

export const useAddress = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const connectedWallet = (user?.linkedAccounts as WalletWithMetadata[])?.find(
    (a) => a.connectorType !== "embedded"
  )?.address!;

  const renderString = (address: string) => {
    if (walletAddress === address) {
      return "You";
    }
    if (address === ZeroAddress) {
      return "None yet";
    }
    return formatAddress(connectedWallet);
  };
  return { renderString, walletAddress };
};
