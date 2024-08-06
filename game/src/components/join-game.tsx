"use client";
import { useAction } from "@/api/useAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export function JoinGame() {
  const { submit } = useAction();

  const joinGame = async (gameId: string) => {
    await submit("joinGame", {
      gameId,
    });

    redirect(`/game/${gameId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Game</DialogTitle>
          <DialogDescription>Add Game ID to join a game</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gameId" className="text-right">
              Game ID
            </Label>
            <Input id="gameId" placeholder="0x232.." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              joinGame(
                document.querySelector<HTMLInputElement>("#gameId")
                  ?.value as string
              );
            }}
          >
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
