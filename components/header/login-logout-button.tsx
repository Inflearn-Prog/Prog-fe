"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "@/hooks/use-logout";
import { ROUTES } from "@/lib/routes";

import { BaseButton } from "../shared/button";

export function LoginAndLogoutButton({
  user,
}: {
  user?: {
    accessToken: string;
  };
}) {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const handleGoingLogin = () => {
    router.push(ROUTES.auth.SIGNIN);
  };
  if (user?.accessToken) {
    return (
      <BaseButton
        onClick={() => logout()}
        variant="outline"
        shape="round"
        className="text-gray-700 border-gray-200 hover:bg-gray-50"
      >
        로그아웃
      </BaseButton>
    );
  }

  return (
    <BaseButton
      onClick={handleGoingLogin}
      shape="round"
      className="text-white bg-frog-600 hover:bg-frog-700"
    >
      로그인
    </BaseButton>
  );
}
