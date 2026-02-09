import React from "react";

import { Header } from "@/components/header/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="grid grid-col-4 lg:grid-cols-12 gap-4 w-full max-w-7xl px-5">
          {children}
        </div>
      </div>
    </div>
  );
}
