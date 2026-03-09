"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Siren, ThumbsUp } from "lucide-react";
import { useCallback, useState } from "react";

import { QuillHtmlViewer } from "@/components/board/QuillHtmlViewer";
import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { BaseButton } from "@/components/shared/button";
import { toasts } from "@/components/shared/toast";
import { cn } from "@/lib/utils";
import { PromptResponse } from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

import { formatCommentDate } from "./utils";

/** 카테고리 한글 매핑 */
const CATEGORY_MAP: Record<string, string> = {
  BACKEND: "개발",
  FRONTEND: "개발",
  AI: "AI",
  ETC: "기타",
};

interface PostDetailProps {
  promptId: string | number;
  prompt: PromptResponse;
}

/**
 * 작성자 프로필 카드 컴포넌트
 * - 프로필 이미지(88px) + 닉네임 + 소개글
 */
function AuthorProfileCard({
  userIcon,
  userName,
  userDesc,
}: {
  userIcon: string;
  userName: string;
  userDesc: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex gap-5 items-end">
      <ProfIcon
        src={userIcon}
        width={88}
        height={88}
        alt={userName}
        fallback={userName}
      />
      <div className="flex flex-1 flex-col gap-1">
        <p className="heading-small text-gray-900">{userName}</p>
        <p className="body-medium text-gray-900 truncate">{userDesc}</p>
      </div>
    </div>
  );
}

/**
 * 게시글 상세 카드 컴포넌트
 * - 카테고리 칩 + 날짜
 * - 제목 + 내용 (HTML 렌더링)
 * - 복사 / 좋아요 / 신고 버튼
 */
export function PostDetail({ promptId, prompt }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState<boolean>(prompt.isLiked ?? false);
  const queryClient = useQueryClient();

  const categoryLabel = CATEGORY_MAP[prompt.category] ?? prompt.category;

  // 좋아요 토글 뮤테이션
  const { mutate: toggleLike } = useMutation({
    mutationFn: () => promptQueries.toggleLike(promptId),
    onMutate: () => {
      // 낙관적 업데이트
      setIsLiked((prev) => !prev);
    },
    onSuccess: () => {
      try {
        queryClient.invalidateQueries({
          queryKey: promptQueries.detail(promptId).queryKey,
        });
      } catch {
        // 캐시 무효화 실패 시 무시
      }
    },
    onError: () => {
      // 실패 시 낙관적 업데이트 롤백
      setIsLiked((prev) => !prev);
    },
  });

  // 내용 복사 핸들러
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toasts.success("프롬프트가 복사되었습니다.");
    } catch {
      // 클립보드 API 미지원 환경 대비
    }
  }, [prompt.content]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 작성자 프로필 카드 */}
      <AuthorProfileCard
        userIcon={prompt.userIcon ?? ""}
        userName={prompt.userName ?? ""}
        userDesc={prompt.userDesc}
      />

      {/* 게시글 상세 카드 */}
      <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex flex-col gap-3">
        {/* 카테고리 칩 + 날짜 */}
        <div className="flex items-end justify-between">
          <span className="px-2.5 py-1 label-small font-semibold text-frog-600 bg-frog-100 rounded-5">
            {categoryLabel}
          </span>
          <span className="label-small text-gray-900">
            {formatCommentDate(prompt.createdAt)}
          </span>
        </div>

        {/* 내용 영역 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* 제목 */}
            <h1 className="heading-medium text-gray-900">{prompt.title}</h1>
            {/* 내용 (HTML) */}
            <QuillHtmlViewer
              html={prompt.content}
              className="body-medium text-gray-900"
            />
          </div>

          {/* 하단 액션 바 */}
          <div className="flex items-end justify-between">
            {/* 복사 버튼 */}
            <BaseButton
              size="sm"
              shape="round"
              onClick={handleCopy}
              className="px-4 py-1 h-7"
            >
              복사
            </BaseButton>

            {/* 좋아요 / 신고 아이콘 */}
            <div className="flex gap-2 items-center">
              <button
                type="button"
                aria-label="좋아요"
                onClick={() => toggleLike()}
                className={cn(
                  "hover:opacity-70 transition-300",
                  isLiked ? "text-frog-600" : "text-gray-700"
                )}
              >
                <ThumbsUp size={20} fill="currentColor" strokeWidth={0} />
              </button>
              <button
                type="button"
                aria-label="신고"
                className="hover:opacity-70 transition-300 text-gray-700"
              >
                <Siren size={20} fill="currentColor" strokeWidth={0} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
