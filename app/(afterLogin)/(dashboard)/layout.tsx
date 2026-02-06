import React from "react";

import { Header } from "@/components/header/header";
import { ProgSidebar } from "@/components/sidebar/category-sidebar";
import { cn } from "@/lib/utils";

export default function layout({ children }: { children: React.ReactNode }) {
  const layout = cn(
    "grid grid-cols-4 md:grid-cols-4 lg:grid-cols-12 gap-4 mx-auto max-w-7xl px-5 min-w-90 mx-auto"
  );
  return (
    <div className="w-full">
      <Header />
      <div className={layout}>
        <div className="hidden md:block md:col-span-1 lg:col-span-3 lg:block">
          <ProgSidebar />
        </div>
        <div className="col-span-4 md:col-span-3 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
