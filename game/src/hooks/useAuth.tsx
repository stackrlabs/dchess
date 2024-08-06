"use client";

import { usePrivy } from "@privy-io/react-auth";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const { ready, user, login, authenticated, logout } = usePrivy();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user?.wallet && pathname !== "/login") {
      redirect("/login");
    }
    if (ready && user?.wallet && pathname === "/login") {
      redirect("/");
    }
  }, [ready, user, pathname]);

  return { ready, user, login, authenticated, logout };
};
