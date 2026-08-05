"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { setFetcherToken } from "@/lib/fetcher"; // 위에서 수정한 fetcher 파일 경로

export function AuthWatcher() {
  const { data: session, update } = useSession();
  const isSigningOut = useRef(false);

  // 만료된 토큰 감지 → 갱신 시도 → 실패 시 로그아웃
  useEffect(() => {
    if (session?.accessToken) {
      setFetcherToken(session.accessToken as string);
    } else if (session === null) {
      setFetcherToken(null);
    }

    const checkSession = async () => {
      if (session?.error === "AccessTokenExpired" && !isSigningOut.current) {
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
