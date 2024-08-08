"use client";
import { getGameActions } from "@/api/api";
import L1Hash from "./l1-hash";
import ViewMetadata from "./view-metadata";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAddress } from "@/lib/utils";
import useSWR from "swr";

const tableHeads = ["Action", "Player", "L1 & DA Stats"];

interface GameActionsProps {
  slug: string;
}

export const GameActions = ({ slug }: GameActionsProps) => {
  const {
    data: mruActions = [],
    isLoading,
    error,
  } = useSWR(`games/${slug}/actions`, () => getGameActions(slug), {
    refreshInterval: 4000,
  });

  return (
    <Table className="overflow-y-scroll">
      {isLoading && <TableCaption>Loading game actions...</TableCaption>}
      {mruActions.length === 0 && <TableCaption>No game actions</TableCaption>}
      <TableHeader>
        <TableRow>
          {tableHeads.map((head, idx) => (
            <TableHead className="font-bold" key={idx}>
              {head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {mruActions.map(({ name, hash, msgSender, blockInfo }) => (
          <TableRow key={hash} className="font-mono">
            <TableCell>{name}</TableCell>
            <TableCell>{formatAddress(msgSender)}</TableCell>
            <TableCell align="right">
              <div className="flex gap-2 content-center">
                <L1Hash l1txHash={blockInfo?.l1TxHash as string} />
                <ViewMetadata daMetadata={blockInfo?.daMetadata} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
