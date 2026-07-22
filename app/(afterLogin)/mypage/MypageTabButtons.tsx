"use client";

import { useRouter } from "next/navigation";

import { BaseButton } from "@/components/shared/button";
import { cn } from "@/lib/utils";

export default function MypageTabButtons({ activeTab }: { activeTab: string }) {
  const router = useRouter();

  const handleTabChange = (tab: "profile" | "activity") => {
    router.push(`/mypage?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="flex gap-5">
      <BaseButton
        onClick={() => handleTabChange("profile")}
        className={cn(
          "px-4 py-2.5 min-w-[197px] shadow-sm transition-colors",
          activeTab === "profile"
            ? "bg-frog-600 text-white"
            : "bg-gray-0 text-gray-700 border border-gray-100"
        )}
      >
        프로필 설정
      </BaseButton>
      <BaseButton
        onClick={() => handleTabChange("activity")}
        className={cn(
          "px-4 py-2.5 min-w-[197px] shadow-sm transition-colors",
          activeTab === "activity"
            ? "bg-frog-600 text-white"
            : "bg-gray-0 text-gray-700 border border-gray-100"
        )}
      >
        내 활동
      </BaseButton>
    </div>
  );
}
