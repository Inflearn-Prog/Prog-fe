"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export function AuthWatcher() {
  const { data: session, update } = useSession();
  const isSigningOut = useRef(false);

  useEffect(() => {
    // 1. 토큰 동기화 로직 추가
    if (session?.accessToken) {
      // fetcher.ts가 읽을 수 있도록 일반 쿠키에 저장 (HttpOnly 쿠키와 이름 충돌 방지)
      document.cookie = `fetcherToken=${session.accessToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    } else if (session === null) {
      // 로그아웃 시 쿠키 제거
      document.cookie = `fetcherToken=; path=/; max-age=0`;
    }

    // 2. 기존 세션 만료 체크 로직
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
