"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Comment, PromptCommentResponse } from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

import { CommentItem } from "./comment-item";

/** 댓글 정렬 타입 */
type SortType = "시간순" | "답글순";

interface CommentListProps extends Pick<Comment, "promptId"> {
  /** 현재 로그인 사용자 정보 (대댓글 폼 프로필에 표시) */
  currentUserIcon?: string | null;
  currentUserName?: string;
}

/**
 * 댓글 목록 컴포넌트
 * - 시간순 / 답글순 정렬 탭
 * - 최상위 댓글과 대댓글을 구분하여 표시
 */
export function CommentList({
  promptId,
  currentUserIcon,
  currentUserName,
}: CommentListProps) {
  const [sortType, setSortType] = useState<SortType>("시간순");

  // 댓글 목록 조회
  const { data: comments = [] } = useQuery({
    ...promptQueries.comments(promptId),
    // 서버 에러 시 빈 배열 반환
  });

  // 최상위 댓글 (parentId = null)
  const topLevelComments = useMemo<PromptCommentResponse[]>(
    () => comments.filter((c) => c.parentId === null),
    [comments]
  );

  // 대댓글 목록
  const replies = useMemo<PromptCommentResponse[]>(
    () => comments.filter((c) => c.parentId !== null),
    [comments]
  );

  /** 특정 댓글의 대댓글 목록 반환 */
  const getRepliesForComment = (commentId: string): PromptCommentResponse[] =>
    replies.filter((r) => r.parentId === commentId);

  // 정렬된 최상위 댓글
  const sortedComments = useMemo<PromptCommentResponse[]>(() => {
    const copied = [...topLevelComments];
    if (sortType === "시간순") {
      // 오래된 순(오름차순)
      return copied.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    // 답글순: 대댓글 많은 순(내림차순)
    return copied.sort(
      (a, b) =>
        getRepliesForComment(b.commentId).length -
        getRepliesForComment(a.commentId).length
    );
  }, [sortType, topLevelComments, replies]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 목록 헤더: 댓글 수 + 정렬 선택 */}
      <div className="flex gap-5 items-end">
        <span className="body-medium text-gray-900">
          댓글 {comments.length}개
        </span>
        <div className="flex gap-1 items-center">
          {/* 시간순 버튼 */}
          <button
            type="button"
            onClick={() => setSortType("시간순")}
            className={`label-small transition-300 ${
              sortType === "시간순"
                ? "font-bold text-frog-600"
                : "text-gray-700"
            }`}
          >
            시간순
          </button>
          <span className="label-small text-gray-700">|</span>
          {/* 답글순 버튼 */}
          <button
            type="button"
            onClick={() => setSortType("답글순")}
            className={`label-small transition-300 ${
              sortType === "답글순"
                ? "font-bold text-frog-600"
                : "text-gray-700"
            }`}
          >
            답글순
          </button>
        </div>
      </div>

      {/* 댓글 아이템 목록 */}
      <div className="flex flex-col gap-5">
        {sortedComments.map((comment) => {
          const commentReplies = getRepliesForComment(comment.commentId);
          return (
            <div
              key={comment.commentId}
              className="flex flex-col gap-2 items-end"
            >
              {/* 최상위 댓글 */}
              <div className="w-full">
                <CommentItem
                  comment={comment}
                  promptId={promptId}
                  currentUserIcon={currentUserIcon ?? ""}
                  currentUserName={currentUserName ?? ""}
                />
              </div>

              {/* 대댓글 목록 (들여쓰기 80px) */}
              {commentReplies.map((reply) => (
                <div key={reply.commentId} className="w-[calc(100%-80px)]">
                  <CommentItem
                    comment={reply}
                    promptId={promptId}
                    isReply
                    currentUserIcon={currentUserIcon ?? ""}
                    currentUserName={currentUserName ?? ""}
                  />
                </div>
              ))}
            </div>
          );
        })}

        {/* 댓글이 없을 때 */}
        {sortedComments.length === 0 && (
          <p className="body-medium text-gray-500 text-center py-8">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </div>
  );
}
