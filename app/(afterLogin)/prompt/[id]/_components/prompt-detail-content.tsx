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
  };
}

export function PromptDetailContent({ id, user }: PromptDetailContentProps) {
  const { data } = useSuspenseQuery({
    ...promptQueries.detail(id),
  });

  const prompt = data;

  return (
    <div className="flex flex-col gap-8">
      {/* 게시글 상세 (작성자 프로필 + 게시글 카드) */}

      <PostDetail promptId={id} prompt={prompt} />

      {/* 댓글 작성 폼 */}
      <CommentForm
        promptId={id}
        userIcon={user?.image ?? null}
        userName={user?.name ?? ""}
      />

      {/* 댓글 목록 */}
      <CommentList
        promptId={id}
        currentUserIcon={user?.image ?? null}
        currentUserName={user?.name ?? ""}
      />
    </div>
  );
}
