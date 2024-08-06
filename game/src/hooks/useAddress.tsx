import { ZeroAddress } from "@/lib/constants";
import { formatHash } from "@/lib/utils";
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
    return formatHash(address);
  };
  return { renderString, walletAddress };
};
