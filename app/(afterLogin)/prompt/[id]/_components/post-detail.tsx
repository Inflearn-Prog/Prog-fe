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
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

function AuthorProfileCard({
  userName,
  userIcon,
  userDesc,
}: {
  userName: string;
  userIcon: string | null;
  userDesc: string | null;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex gap-5 items-end">
      <ProfIcon
        src={userIcon}
        width={88}
        height={88}
        alt={userName}
        fallback={userName || "U"}
      />
      <div className="flex flex-1 flex-col gap-1">
        <p className="heading-small text-gray-900">{userName}</p>
        <p className="body-medium text-gray-500">
          {userDesc ?? "소개가 없습니다."}
        </p>
      </div>
    </div>
  );
}

export function PostDetail({ promptId, prompt, user }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(prompt.isLiked);
  const [likesCount, setLikesCount] = useState(prompt.likes);
  const queryClient = useQueryClient();

  const categoryLabel = prompt.category.name;

  const { mutate: toggleLike } = useMutation({
    mutationFn: (_vars: { currentlyLiked: boolean }) =>
      promptQueries.toggleLike(promptId),
    onMutate: ({ currentlyLiked }) => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) =>
        currentlyLiked ? Math.max(prev - 1, 0) : prev + 1
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.detail(promptId).queryKey,
      });
    },
    onError: (_, { currentlyLiked }) => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) =>
        currentlyLiked ? prev + 1 : Math.max(prev - 1, 0)
      );
    },
  });

  const handleCopy = useCallback(async () => {
    try {
      const el = document.createElement("div");
      el.innerHTML = prompt.content;
      const plainText = el.textContent || "";
      await navigator.clipboard.writeText(plainText);
      toasts.success("프롬프트가 복사되었습니다.");
    } catch {
      toasts.error("클립보드 복사에 실패했습니다.");
    }
  }, [prompt.content]);

  const handleLikeClick = useCallback(() => {
    if (!user) {
      toasts.error("로그인 후 이용할 수 있습니다.");
      return;
    }
    toggleLike({ currentlyLiked: isLiked });
  }, [user, toggleLike, isLiked]);

  const handleReportClick = useCallback(() => {
    if (!user) {
      toasts.error("로그인 후 이용할 수 있습니다.");
      return;
    }
    // 신고 로직은 기존과 동일하게 유지
  }, [user]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <AuthorProfileCard
        userName={prompt.userName}
        userIcon={prompt.userIcon}
        userDesc={prompt.userDesc}
      />

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
                onClick={handleLikeClick}
                className={cn(
                  "flex items-center gap-1 hover:opacity-70 transition-300",
                  isLiked ? "text-frog-600" : "text-gray-700"
                )}
              >
                <ThumbsUp size={20} fill="currentColor" strokeWidth={0} />
                <span className="label-small">{likesCount}</span>
              </button>
              <button
                type="button"
                aria-label="신고"
                onClick={handleReportClick}
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
