"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

const TABS = [
  { key: "dashboard", label: "대시보드" },
  { key: "prompts", label: "게시글 관리" },
  { key: "users", label: "유저 관리" },
  { key: "notices", label: "공지사항" },
  { key: "categories", label: "카테고리 관리" },
] as const;

export type AdminTabKey = (typeof TABS)[number]["key"];

export function AdminTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as AdminTabKey) || "dashboard";

  const handleTabClick = (key: AdminTabKey) => {
    router.push(`/admin?tab=${key}`);
  };

  return (
    <div className="flex gap-5">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handleTabClick(key)}
          className={cn(
            "w-[197px] rounded-md py-3 text-sm font-medium transition-colors",
            currentTab === key
              ? "bg-frog-600 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
