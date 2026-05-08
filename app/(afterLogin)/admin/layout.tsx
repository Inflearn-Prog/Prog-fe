import React, { Suspense } from "react";

import { Header } from "@/components/header/header";

import { AdminTabs } from "./admin-tabs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
