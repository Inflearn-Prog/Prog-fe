"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { BaseButton } from "@/components/shared/button";
import { toasts } from "@/components/shared/toast";
import { promptQueries } from "@/queries/options/prompt-query";

import { MAX_COMMENT_LENGTH } from "../../constant";

interface CommentFormProps {
  promptId: string | number;
  parentCommentId?: number;
  userIcon?: string | null;
  userName?: string | null;
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
    // 앞뒤 공백을 떼고 보낸다. 서버 @NotBlank 는 trim 후 판정하므로 "  하이  " 는 통과하는데,
    // 그대로 저장되면 목록에서 들쭉날쭉하게 보인다.
    mutationFn: () => {
      const body = { comment: comment.trim() };
      if (parentCommentId !== undefined) {
        return promptQueries.createReply(promptId, parentCommentId, body);
      }
      return promptQueries.createComment(promptId, body);
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({
        queryKey: promptQueries.comments(promptId).queryKey,
      });
      toasts.success("댓글이 등록되었습니다.");
      onSuccess?.();
    },
    onError: () => {
      toasts.error("댓글 등록에 실패했습니다.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH));
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      toasts.error("댓글 내용을 입력해주세요.");
      return;
    }
    submitComment();
  };

  return (
    <div className="flex gap-5 items-start w-full">
      <ProfIcon
        src={userIcon}
        width={60}
        height={60}
        alt={userName ?? ""}
        fallback={userName || "U"}
      />

      <div className="flex flex-1 flex-col gap-2">
        <div className="relative bg-white border border-gray-50 rounded-5 h-36 px-4 py-2 overflow-hidden">
          <textarea
            value={comment}
            onChange={handleChange}
            placeholder="댓글을 남겨주세요."
            aria-label="댓글 입력"
            className="w-full h-full body-medium text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none bg-transparent"
          />
          <span className="absolute bottom-2 right-2 caption-small text-gray-500">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>

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
