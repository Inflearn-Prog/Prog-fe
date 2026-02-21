"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  LikedArticleCard,
  MyArticleCard,
} from "@/components/mypage/articleCard";
import { PaginationButton } from "@/components/pagination-button/pagination-button";
import { toasts } from "@/components/shared/toast";
import { useLikedPrompts, useUserPrompts } from "@/hooks/use-mypage";
import { cn } from "@/lib/utils";

export default function MypageActivitySection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. 현재 탭 및 페이지 상태 관리
  const rawSub = searchParams.get("sub");
  const activeSub: "liked" | "posted" =
    rawSub === "posted" ? "posted" : "liked";
  const currentPage = Number(searchParams.get("page")) || 0;
  const userId = 1; // 실제로는 인증 정보나 프로필 훅에서 가져온 ID 사용

  const { data: likedData, isLoading: isLikedLoading } = useLikedPrompts(
    userId,
    currentPage
  );
  const { data: postedData, isLoading: isPostedLoading } = useUserPrompts({
    userId,
    page: currentPage,
  });

  const handleSubTabChange = (sub: "liked" | "posted") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sub", sub);
    params.set("page", "0");
    router.push(`/mypage?${params.toString()}`, { scroll: false });
  };

  const handleCopy = async (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(content);
      toasts.success("프롬프트가 클립보드에 복사되었습니다!");
    } catch {
      alert("복사에 실패했습니다.");
    }
  };
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/mypage?${params.toString()}`, { scroll: false });
  };

  const handleCardClick = (id: number) => {
    router.push(`/prompts/${id}`);
  };

  // 현재 활성화된 데이터와 로딩 상태 결정
  const currentData = activeSub === "liked" ? likedData : postedData;
  const isLoading = activeSub === "liked" ? isLikedLoading : isPostedLoading;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 서브 탭 메뉴 */}
      <div className="flex w-full bg-gray-0 border border-gray-100 rounded-[8px] overflow-hidden p-1 shadow-sm">
        <button
          onClick={() => handleSubTabChange("liked")}
          className={cn(
            "flex-1 py-2.5 label-medium !font-bold transition-all rounded-[6px]",
            activeSub === "liked"
              ? "bg-blue-600 text-gray-0 shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          좋아요한 프롬프트
        </button>
        <button
          onClick={() => handleSubTabChange("posted")}
          className={cn(
            "flex-1 py-2.5 label-medium !font-bold transition-all rounded-[6px]",
            activeSub === "posted"
              ? "bg-blue-600 text-gray-0 shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          게시한 프롬프트
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">로딩 중...</div>
        ) : currentData?.content.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            {activeSub === "liked"
              ? "좋아요한 프롬프트가 없습니다."
              : "게시한 프롬프트가 없습니다."}
          </div>
        ) : (
          currentData?.content.map((prompt) =>
            activeSub === "liked" ? (
              <LikedArticleCard
                key={prompt.promptId}
                title={prompt.title}
                content={prompt.description}
                onCopy={(e) => handleCopy(e, prompt.description)}
                onClick={() => handleCardClick(prompt.promptId)}
              />
            ) : (
              <MyArticleCard
                key={prompt.promptId}
                title={prompt.title}
                content={prompt.description}
                createdAt={prompt.createdAt}
                onClick={() => handleCardClick(prompt.promptId)}
              />
            )
          )
        )}
      </div>

      {/* 단순 페이지네이션 (필요 시 추가) */}
      {!isLoading && (currentData?.pageInfo.totalPages ?? 0) > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <PaginationButton
            currentPage={currentPage}
            totalPages={currentData?.pageInfo.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
