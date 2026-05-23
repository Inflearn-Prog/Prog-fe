"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import { setFetcherToken } from "@/lib/fetcher"; // 위에서 수정한 fetcher 파일 경로

export function AuthWatcher() {
  const { data: session, update } = useSession();
  const isSigningOut = useRef(false);

  // accessToken → 쿠키 동기화 (CSR에서 fetcher가 읽을 수 있도록)
  useEffect(() => {
    const token = (session as unknown as Record<string, unknown>)
      ?.accessToken as string | undefined;

    if (token) {
      setFetcherToken(token);
      document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } else if (session === null) {
      setFetcherToken(null);
      document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
    }
  }, [session]);

  // 만료된 토큰 감지 → 갱신 시도 → 실패 시 로그아웃
  useEffect(() => {
    if (isSigningOut.current) return;

    const checkSession = async () => {
      if (session?.error === "AccessTokenExpired" && !isSigningOut.current) {
        const newSession = await update();
        if (newSession?.error === "AccessTokenExpired") {
          isSigningOut.current = true;
          document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
          signOut({ callbackUrl: "/signin" });
        }
      }
    };

    checkSession();
  }, [session, update]);

  return null;
}
