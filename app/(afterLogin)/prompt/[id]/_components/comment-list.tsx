"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { ApiError } from "@/lib/fetcher";
import { PromptCommentResponse } from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

import { CommentItem } from "./comment-item";

type SortType = "시간순" | "답글순";

interface CommentListProps {
  promptId: string | number;
  isLoggedIn?: boolean;
  currentUserIcon?: string | null;
  currentUserName?: string;
}

export function CommentList({
  promptId,
  isLoggedIn = false,
  currentUserIcon,
  currentUserName,
}: CommentListProps) {
  const [sortType, setSortType] = useState<SortType>("시간순");

  const {
    data: comments = [],
    error,
    isError,
  } = useQuery({
    ...promptQueries.comments(promptId),
  });

  const topLevelComments = useMemo<PromptCommentResponse[]>(
    () => comments.filter((c) => c.parentId === null),
    [comments]
  );

  const repliesByParent = useMemo(() => {
    const map = new Map<number, PromptCommentResponse[]>();
    for (const c of comments) {
      if (c.parentId !== null) {
        const list = map.get(c.parentId) ?? [];
        list.push(c);
        map.set(c.parentId, list);
      }
    }
    return map;
  }, [comments]);

  const sortedComments = useMemo<PromptCommentResponse[]>(() => {
    const copied = [...topLevelComments];
    if (sortType === "시간순") {
      return copied.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return copied.sort((a, b) => {
      const replyDiff =
        (repliesByParent.get(b.commentId)?.length ?? 0) -
        (repliesByParent.get(a.commentId)?.length ?? 0);
      if (replyDiff !== 0) return replyDiff;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [sortType, topLevelComments, repliesByParent]);

  if (isError) {
    const isAccessDenied =
      error instanceof ApiError && error.httpStatus === 403;

    return (
      <div className="flex flex-col gap-5 w-full">
        <p className="body-medium text-gray-500 text-center py-8">
          {isAccessDenied
            ? "댓글을 볼 수 없습니다."
            : "댓글을 불러오는 중 오류가 발생했습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex gap-5 items-end">
        <span className="body-medium text-gray-900">
          댓글 {comments.length}개
        </span>
        <div className="flex gap-1 items-center">
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

      <div className="flex flex-col gap-5">
        {sortedComments.map((comment) => {
          const commentReplies = repliesByParent.get(comment.commentId) ?? [];
          return (
            <div
              key={comment.commentId}
              className="flex flex-col gap-2 items-end"
            >
              <div className="w-full">
                <CommentItem
                  comment={comment}
                  promptId={promptId}
                  isLoggedIn={isLoggedIn}
                  currentUserIcon={currentUserIcon ?? ""}
                  currentUserName={currentUserName ?? ""}
                />
              </div>

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

        {sortedComments.length === 0 && (
          <p className="body-medium text-gray-500 text-center py-8">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </div>
  );
}
