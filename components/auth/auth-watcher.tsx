"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthWatcher() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const checkSession = async () => {
      if (session?.error === "AccessTokenExpired") {
        const newSession = await update();
        if (newSession?.error === "AccessTokenExpired") {
          signOut({ callbackUrl: "/signin" });
        }
      }
    };

    checkSession();
  }, [session, update]);

  return null;
}
