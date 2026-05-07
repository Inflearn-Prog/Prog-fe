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

interface PostDetailProps {
  promptId: string | number;
  prompt: PromptResponse;
}

// TODO: 서버에 GET /users/{userId} 엔드포인트 없음
// 현재는 프로필 영역을 userId 기반 placeholder로 표시
// 서버 엔드포인트 추가 후 실제 사용자 정보로 교체 필요
function AuthorProfileCard({ userId }: { userId: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex gap-5 items-end">
      <ProfIcon
        src={null}
        width={88}
        height={88}
        alt={`사용자 ${userId}`}
        fallback={`U${userId}`}
      />
      <div className="flex flex-1 flex-col gap-1">
        <p className="heading-small text-gray-900">{`사용자 ${userId}`}</p>
        <p className="body-medium text-gray-500">
          프로필 정보를 불러올 수 없습니다.
        </p>
      </div>
    </div>
  );
}

export function PostDetail({ promptId, prompt }: PostDetailProps) {
  // TODO: 좋아요 상태를 서버에서 가져오는 방법 필요 (현재 PromptResponse에 isLiked 없음)
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const categoryLabel = prompt.category.name;

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => promptQueries.toggleLike(promptId),
    onMutate: () => {
      setIsLiked((prev) => !prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.detail(promptId).queryKey,
      });
    },
    onError: () => {
      setIsLiked((prev) => !prev);
    },
  });

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toasts.success("프롬프트가 복사되었습니다.");
    } catch {
      toasts.error("클립보드 복사에 실패했습니다.");
    }
  }, [prompt.content]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <AuthorProfileCard userId={prompt.userId} />

      <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <span className="px-2.5 py-1 label-small font-semibold text-frog-600 bg-frog-100 rounded-5">
            {categoryLabel}
          </span>
          <span className="label-small text-gray-900">
            {formatCommentDate(prompt.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="heading-medium text-gray-900">{prompt.title}</h1>
            <QuillHtmlViewer
              html={prompt.content}
              className="body-medium text-gray-900"
            />
          </div>

          <div className="flex items-end justify-between">
            <BaseButton
              size="sm"
              shape="round"
              onClick={handleCopy}
              className="px-4 py-1 h-7"
            >
              복사
            </BaseButton>

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
