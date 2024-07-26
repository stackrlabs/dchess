import { ZeroAddress } from "@/lib/constants";
import { formatAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";

export const useAddress = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const renderString = (address: string) => {
    if (walletAddress === address) {
      return "You";
    }
    if (address === ZeroAddress) {
      return "None yet";
    }
    return formatAddress(address);
  };
  return { renderString, walletAddress };
};
