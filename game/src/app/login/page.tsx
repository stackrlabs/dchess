"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { ready, authenticated, login } = useAuth();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div className="flex w-full justify-center">
      <Button disabled={disableLogin} onClick={login}>
        Log in
      </Button>
    </div>
  );
}
