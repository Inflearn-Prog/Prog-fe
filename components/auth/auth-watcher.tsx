"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export function AuthWatcher() {
  const { data: session, update } = useSession();
  const isSigningOut = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      if (session?.error === "AccessTokenExpired") {
        const newSession = await update();
        if (newSession?.error === "AccessTokenExpired") {
          isSigningOut.current = true;
          signOut({ callbackUrl: "/signin" });
        }
      }
    };

    checkSession();
  }, [session, update]);

  return null;
}
