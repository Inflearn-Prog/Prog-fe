"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

import { ROUTES } from "@/lib/routes";
import { postLogout } from "@/queries/api/auth";

export default function LogoutPage() {
  const { mutate: logout, isPending } = useMutation({
    mutationFn: postLogout,
    onSettled: () => {
      signOut({ callbackUrl: ROUTES.auth.SIGNIN });
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl mb-4">정말 로그아웃 하시겠습니까?</h1>
      <button
        onClick={() => logout()}
        disabled={isPending}
        className="px-6 py-2 bg-black text-white rounded-md"
      >
        {isPending ? "로그아웃 중..." : "확인"}
      </button>
    </div>
  );
}
