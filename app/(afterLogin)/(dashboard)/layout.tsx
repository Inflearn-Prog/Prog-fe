import { Suspense } from "react";

import { Header } from "@/components/header/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="h-15 w-full bg-white border-b border-b-gray-100" />
        }
      >
        <Header />
      </Suspense>
      <>{children}</>
    </div>
  );
}
