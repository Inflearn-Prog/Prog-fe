"use client";

import { useSearchParams } from "next/navigation";

import { AdminTabKey } from "./admin-tabs";
import { CategoriesTab } from "./categories/categories-tab";
import { DashboardTab } from "./dashboard/dashboard-tab";
import { NoticesTab } from "./notices/notices-tab";
import { PromptsTab } from "./prompts/prompts-tab";
import { UsersTab } from "./users/users-tab";

export function AdminContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as AdminTabKey) || "dashboard";

  switch (tab) {
    case "dashboard":
      return <DashboardTab />;
    case "prompts":
      return <PromptsTab />;
    case "users":
      return <UsersTab />;
    case "categories":
      return <CategoriesTab />;
    case "notices":
      return <NoticesTab />;
    default:
      return <DashboardTab />;
  }
}
