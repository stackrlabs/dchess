"use client";

import { DA, DA_POINTER_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DAMetadata } from "@/api/api";
import { DAImage } from "./da-image";


const getExplorerUrl = (
  daMetadata: Record<DA, Record<string, string | number>>
) => {
  const daName = Object.keys(daMetadata)[0] as DA;
  if (!daName || !daMetadata[daName]) {
    return "";
  }
  const values = daMetadata[daName];

  switch (daName) {
    case DA.AVAIL:
      return `${DA_POINTER_URL[daName]}/${values.blockHeight}-${values.extIdx}`;
    case DA.CELESTIA:
      return `${DA_POINTER_URL[daName]}/${values.txHash}`;
    case DA.EIGEN:
      return `${DA_POINTER_URL[daName]}/${values.requestID}`;
    default:
      return "";
  }
};

interface ViewMetadataProps {
  daMetadata: DAMetadata | undefined;
}

export default function ViewMetadata({ daMetadata }: ViewMetadataProps) {
  const daName = Object.keys(daMetadata || {})?.[0] as DA;
  if (!daName || !daMetadata?.[daName]) {
    return null;
  }

  return (
    <div>
      <a
        href={getExplorerUrl(daMetadata)}
        target="_blank"
        rel="noreferrer"
        className={cn("flex w-[fit-content] gap-2 p-2")}
      >
        <DAImage da={daName} />
      </a>
    </div>
  );
}
