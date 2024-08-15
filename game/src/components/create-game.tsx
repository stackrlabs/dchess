"use client";
import { useAction } from "@/api/useAction";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export const CreateGame = () => {
  const [loading, setLoading] = useState(false);
  const { submit } = useAction();
  const router = useRouter();

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const { logs } = await submit("createGame", {
        color: "w",
      });
      const gameId = logs[0].value;
      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="font-mono uppercase"
      disabled={loading}
      onClick={handleCreateGame}
      variant={"secondary"}
    >
      <div className="flex items-center gap-3">
        {loading ? "Creating game..." : "Create New game"}
        <Plus size={15} />
      </div>
    </Button>
  );
};
