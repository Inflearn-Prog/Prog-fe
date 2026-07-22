import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import { Header } from "@/components/header/header";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

import { AdminTabs } from "./admin-tabs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 백엔드 JWT의 auth 클레임(예: "ROLE_USER,ROLE_ADMIN")으로만 관리자 여부 판별 가능.
  // 비관리자/비로그인 사용자가 URL로 강제 진입 시 랭킹 페이지로 리다이렉트한다.
  const session = await auth();
  const accessToken = session?.accessToken;

  let isAdmin = false;
  if (accessToken) {
    try {
      const { auth: authClaim } = jwtDecode<{ auth?: string }>(accessToken);
      isAdmin = authClaim?.split(",").includes("ROLE_ADMIN") ?? false;
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    redirect(ROUTES.rank.ROOT);
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold">관리자 페이지</h1>
        <Suspense>
          <AdminTabs />
        </Suspense>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
