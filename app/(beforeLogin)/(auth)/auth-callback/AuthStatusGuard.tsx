"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

interface AuthStatusGuardProps {
  children: ReactNode;
}

export function AuthStatusGuard({ children }: AuthStatusGuardProps) {
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
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>인증 상태를 확인 중입니다...</p>
      </div>
    );
  }

  return <>{children}</>;
}
