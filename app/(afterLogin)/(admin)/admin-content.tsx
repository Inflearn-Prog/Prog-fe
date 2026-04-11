"use client";

import { useSearchParams } from "next/navigation";

import { AdminTabKey } from "./admin-tabs";
import { DashboardTab } from "./dashboard/dashboard-tab";
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
      return <div className="text-gray-500">카테고리 관리 (준비 중)</div>;
    case "notices":
      return <div className="text-gray-500">공지사항 (준비 중)</div>;
    default:
      return <DashboardTab />;
  }
}
