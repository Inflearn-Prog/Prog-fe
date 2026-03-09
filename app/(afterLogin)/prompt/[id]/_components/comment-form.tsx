"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { BaseButton } from "@/components/shared/button";
import { toasts } from "@/components/shared/toast";
import { Comment, Prompt } from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

const MAX_COMMENT_LENGTH = 1000;

interface CommentFormProps extends Pick<
  Prompt,
  "promptId" | "userIcon" | "userName"
> {
  parentCommentId?: Comment["parentCommentId"];
  onSuccess?: () => void;
}

export function CommentForm({
  promptId,
  parentCommentId,
  userIcon = null,
  userName = "",
  onSuccess,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: () => {
      // 대댓글 또는 댓글 API 분기
      if (parentCommentId !== undefined) {
        return promptQueries.createReply(promptId, parentCommentId, {
          comment,
        });
      }
      return promptQueries.createComment(promptId, { comment });
    },
    onSuccess: () => {
      try {
        setComment("");
        // 댓글 목록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: promptQueries.comments(promptId).queryKey,
        });
        toasts.success("댓글이 등록되었습니다.");
        onSuccess?.();
      } catch {
        // 캐시 무효화 실패 시 무시
      }
    },
    onError: () => {
      // 댓글 작성 실패 시 사용자에게 알림 없이 무시 (추후 토스트 추가 가능)
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH));
  };

  const handleSubmit = () => {
    if (!comment.trim()) return;
    submitComment();
  };

  return (
    <div className="flex gap-5 items-start w-full">
      {/* 프로필 아이콘 */}
      <ProfIcon
        src={userIcon}
        width={60}
        height={60}
        alt={userName ?? ""}
        fallback={userName || "U"}
      />

      {/* 댓글 입력 영역 */}
      <div className="flex flex-1 flex-col gap-2">
        {/* textarea 래퍼 */}
        <div className="relative bg-white border border-gray-50 rounded-5 h-36 px-4 py-2 overflow-hidden">
          <textarea
            value={comment}
            onChange={handleChange}
            placeholder="댓글을 남겨주세요."
            aria-label="댓글 입력"
            className="w-full h-full body-medium text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none bg-transparent"
          />
          {/* 글자 수 카운터 */}
          <span className="absolute bottom-2 right-2 caption-small text-gray-500">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>

        {/* 댓글 남기기 버튼 */}
        <BaseButton
          full
          onClick={handleSubmit}
          disabled={!comment.trim() || isPending}
          className="h-10 rounded-[6px]"
        >
          댓글 남기기
        </BaseButton>
      </div>
    </div>
  );
}
