"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session) {
      if (session.isNewUser) {
        router.replace("/signup");
      } else {
        router.replace("/");
      }
    } else if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그인 정보를 확인 중입니다...</p>
    </div>
  );
}
