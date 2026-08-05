"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  LikedArticleCard,
  MyArticleCard,
} from "@/components/mypage/articleCard";
import { PaginationButton } from "@/components/pagination-button/pagination-button";
import { useCopyPrompt } from "@/hooks/use-copy-prompt";
import { useSubTabFilters } from "@/hooks/use-filters";
import { useLikedPrompts, useUserPrompts } from "@/hooks/use-mypage";
import { cn } from "@/lib/utils";

// 한 페이지 노출 건수. useLikedPrompts/useUserPrompts 의 size 와 totalPages 계산이 이 값을 공유한다.
const PAGE_SIZE = 4;

export default function MypageActivitySection() {
  const router = useRouter();
  const { copyById } = useCopyPrompt();

  const { currentSub, currentPage, handleSubTabChange, handlePageChange } =
    useSubTabFilters("mypage");

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const activeSub = currentSub as "liked" | "posted";

  const { data: likedData, isLoading: isLikedLoading } = useLikedPrompts({
    userId: userId as string,
    page: currentPage,
    size: PAGE_SIZE,
    enabled: !!userId && activeSub === "liked",
  });
  const { data: postedData, isLoading: isPostedLoading } = useUserPrompts({
    userId: userId as string,
    page: currentPage,
    size: PAGE_SIZE,
    enabled: !!userId && activeSub === "posted",
  });

  const handleCopy = (e: React.MouseEvent, promptId: number) => {
    e.stopPropagation();
    copyById(promptId);
  };

  const handleCardClick = (id: number) => {
    router.push(`/prompt/${id}`);
  };

  // 현재 활성화된 데이터와 로딩 상태 결정
  const currentData = activeSub === "liked" ? likedData : postedData;
  const isLoading = activeSub === "liked" ? isLikedLoading : isPostedLoading;

  const hasContent =
    currentData && currentData.prompts && currentData.prompts.length > 0;
  // BE 가 pageInfo 를 주면 그대로, 아니면(현재 실서버 응답은 totalCount 만) 계산한다. (P0-08)
  const totalPages =
    currentData?.pageInfo?.totalPages ??
    Math.ceil((currentData?.totalCount ?? 0) / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 서브 탭 메뉴 */}
      <div className="flex w-full bg-gray-0 border border-gray-100 rounded-[8px] overflow-hidden p-1 shadow-sm">
        <button
          onClick={() => handleSubTabChange("liked")}
          className={cn(
            "flex-1 py-2.5 label-medium !font-bold transition-all rounded-[6px]",
            activeSub === "liked"
              ? "bg-frog-600 text-gray-0 shadow-sm"
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
              ? "bg-frog-600 text-gray-0 shadow-sm"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          게시한 프롬프트
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 font-medium">
            로딩 중...
          </div>
        ) : !hasContent ? (
          <div className="py-20 text-center text-gray-400 border border-dashed rounded-2xl">
            {activeSub === "liked"
              ? "좋아요한 프롬프트가 없습니다."
              : "게시한 프롬프트가 없습니다."}
          </div>
        ) : (
          currentData.prompts.map((prompt) =>
            activeSub === "liked" ? (
              <LikedArticleCard
                key={prompt.promptId}
                title={prompt.title}
                contentSummary={prompt.contentSummary}
                onCopy={(e) => handleCopy(e, prompt.promptId)}
                onClick={() => handleCardClick(prompt.promptId)}
              />
            ) : (
              <MyArticleCard
                key={prompt.promptId}
                title={prompt.title}
                contentSummary={prompt.contentSummary}
                createdAt={prompt.createdAt}
                onClick={() => handleCardClick(prompt.promptId)}
              />
            )
          )
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <PaginationButton
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
