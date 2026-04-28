"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { ROUTES } from "@/lib/routes";

import { BaseButton } from "../shared/button";

export function LoginAndLogoutButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoingLogin = () => {
    router.push(ROUTES.auth.SIGNIN);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: ROUTES.auth.SIGNIN });
  };

  if (session?.accessToken) {
    return (
      <BaseButton onClick={handleSignOut} shape="round" variant="outline">
        로그아웃
      </BaseButton>
    );
  }

  return (
    <BaseButton onClick={handleGoingLogin} shape="round">
      로그인
    </BaseButton>
  );
}
