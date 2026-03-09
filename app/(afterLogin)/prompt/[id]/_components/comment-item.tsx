"use client";

import { Reply, Siren, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";
import { Comment, PromptCommentResponse } from "@/queries/api/prompts";

import { CommentForm } from "./comment-form";
import { formatCommentDate } from "./utils";

type CommentItemProps = {
  comment: PromptCommentResponse;
  promptId: Comment["promptId"];
  isReply?: Comment["isReply"];
  currentUserIcon: Comment["currentUserIcon"];
  currentUserName: Comment["currentUserName"];
};

export function CommentItem({
  comment,
  promptId,
  isReply = false,
  currentUserIcon,
  currentUserName,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleToggleReplyForm = () => {
    setShowReplyForm((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-5 items-start w-full">
        {/* 프로필 아이콘 */}
        <ProfIcon
          src={null}
          width={60}
          height={60}
          alt={comment.nickName}
          fallback={comment.nickName}
        />

        {/* 댓글 내용 카드 */}
        <div className="flex-1 flex flex-col gap-2 bg-white border border-gray-100 rounded-10 shadow-sm px-5 py-3">
          {/* 닉네임 + 날짜 + 내용 */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-2.5 items-end">
              <span className="body-large font-normal text-gray-900">
                {comment.nickName}
              </span>
              <span className="label-small text-gray-600">
                {formatCommentDate(comment.createdAt)}
              </span>
            </div>
            <p className="body-medium text-gray-900">{comment.comment}</p>
          </div>

          {/* 액션 버튼 영역 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {/* 답글달기 버튼 (대댓글에서는 숨김) */}
              {!isReply && (
                <button
                  type="button"
                  aria-label="답글 달기"
                  onClick={handleToggleReplyForm}
                  className="hover:opacity-70 transition-300"
                >
                  <Reply
                    size={20}
                    className={
                      showReplyForm ? "text-frog-600" : "text-gray-700"
                    }
                  />
                </button>
              )}
              {/* 좋아요 버튼 */}
              <button
                type="button"
                aria-label="좋아요"
                className="hover:opacity-70 transition-300"
              >
                <ThumbsUp
                  size={20}
                  fill="currentColor"
                  strokeWidth={0}
                  className="text-gray-700"
                />
              </button>
            </div>

            {/* 신고 버튼 */}
            <button
              type="button"
              aria-label="신고"
              className="hover:opacity-70 transition-300"
            >
              <Siren
                size={20}
                fill="currentColor"
                strokeWidth={0}
                className="text-gray-700"
              />
            </button>
          </div>
        </div>
      </div>

      {/* 대댓글 작성 폼 (답글달기 클릭 시 표시) */}
      {showReplyForm && (
        <div className="pl-20">
          <CommentForm
            promptId={promptId}
            parentCommentId={comment.commentId}
            userIcon={currentUserIcon}
            userName={currentUserName}
            onSuccess={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
