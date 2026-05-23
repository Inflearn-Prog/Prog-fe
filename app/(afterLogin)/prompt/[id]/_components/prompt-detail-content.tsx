"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { promptQueries } from "@/queries/options/prompt-query";

import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { PostDetail } from "./post-detail";

interface PromptDetailContentProps {
  id: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function PromptDetailContent({ id, user }: PromptDetailContentProps) {
  const { data } = useSuspenseQuery({
    ...promptQueries.detail(id),
  });

  const prompt = data;

  return (
    <div className="flex flex-col gap-8">
      {/* 게시글 상세 (작성자 프로필 + 게시글 카드) */}
      <PostDetail promptId={id} prompt={prompt} user={user} />

      {/* 댓글 작성 폼 — 로그인한 사용자만 표시 */}
      {user ? (
        <CommentForm
          promptId={id}
          userIcon={user?.image ?? null}
          userName={user?.name ?? ""}
        />
      ) : (
        <p className="body-medium text-gray-500 text-center py-4">
          로그인 후 댓글을 작성할 수 있습니다.
        </p>
      )}

      {/* 댓글 목록 */}
      <CommentList
        promptId={id}
        currentUserIcon={user?.image ?? null}
        currentUserName={user?.name ?? ""}
      />
    </div>
  );
}
