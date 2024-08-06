"use client";
import { useAction } from "@/api/useAction";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export const CreateGame = () => {
  const [loading, setLoading] = useState(false);
  const { submit } = useAction();
  const router = useRouter();

  const handleCreateGame = async () => {
    setLoading(true);
    const { logs } = await submit("createGame", {
      color: "w",
    });
    const gameId = logs[0].value;
    setLoading(false);
    router.push(`/game/${gameId}`);
  };

  return (
    <Button disabled={loading} onClick={handleCreateGame}>
      {loading ? "Creating game..." : "Create game"}
    </Button>
  );
};
