"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/lib/routes";

import { BaseButton } from "../shared/button";

// 지금 authjs가 붙지 않은고로, 대체 props 사용
export function LoginAndLogoutButton({
  user,
}: {
  user?: {
    accessToken: string;
  };
}) {
  const router = useRouter();
  const handleGoingLogin = () => {
    router.push(ROUTES.auth.SIGNIN);
  };
  if (user?.accessToken) {
    return (
      <BaseButton
        onClick={() => {
          // SIGNOUT 함수 사용
        }}
        shape="round"
        variant="outline"
      >
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
