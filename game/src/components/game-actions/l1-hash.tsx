import { ExternalLink } from "lucide-react";
import { formatHash } from "@/lib/utils";
import { zeroHash } from "viem";

interface RenderL1HashProps {
  l1txHash: string;
}

export default function L1Hash({ l1txHash }: RenderL1HashProps) {
  if (!l1txHash || l1txHash === zeroHash) {
    return <p className="text-slate-600">not batched yet</p>;
  }

  return (
    <div className="text-center content-center">
      <a
        href={`https://sepolia.etherscan.io/tx/${l1txHash}`}
        className="flex items-center gap-2 hover:underline"
        target="_blank"
      >
        <pre>{formatHash(l1txHash || "")}</pre>
        <ExternalLink size={16} />
      </a>
    </div>
  );
}
