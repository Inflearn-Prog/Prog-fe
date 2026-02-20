"use client";
import { useRouter, useSearchParams } from "next/navigation";

import { BaseButton } from "@/components/shared/button";
import { PageTitleGroup } from "@/components/shared/page-title-group";
import { cn } from "@/lib/utils";

import MypageActivitySection from "./MypageActivity";
import MypageLeftSection from "./MypageLeftSection";
import MypageRightSection from "./MypageRightSection";

export default function MyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 tab 파라미터를 가져옴 (기본값: profile)
  const activeTab =
    (searchParams.get("tab") as "profile" | "activity") || "profile";

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tab: "profile" | "activity") => {
    router.push(`/mypage?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 bg-gray-50">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-10">
        <div className="lg:col-start-4 lg:col-span-9 mb-17.5 col-span-4">
          <PageTitleGroup title={"마이페이지"} />
        </div>
        <div className="lg:col-start-4 lg:col-span-9 col-span-4 mb-7">
          <div className="flex gap-5">
            <BaseButton
              onClick={() => handleTabChange("profile")}
              className={cn(
                "px-4 py-2.5 min-w-[197px] shadow-sm transition-colors",
                activeTab === "profile"
                  ? "bg-frog-600"
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
                  ? "bg-frog-600"
                  : "bg-gray-0 text-gray-700 border border-gray-100 hover:text-gray-0"
              )}
            >
              내 활동
            </BaseButton>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-start">
        {/* 왼쪽: 유저 프로필 */}
        <aside className="col-span-4 lg:flex lg:col-span-3 flex-col gap-6">
          <MypageLeftSection />
        </aside>

        {/* 오른쪽: 정보수정 */}
        <main className="col-span-4 lg:col-span-9 flex flex-col gap-4">
          {activeTab === "profile" ? (
            <MypageRightSection />
          ) : (
            <MypageActivitySection />
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * 마이페이지 search params
 *
 * - tab
 * profile
 * tab
 *
 * - sub
 * liked
 * posted
 */
