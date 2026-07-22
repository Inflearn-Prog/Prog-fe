"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useUserProfile } from "@/hooks/use-mypage";
import { promptQueries } from "@/queries/options/prompt-query";

import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { PostDetail } from "./post-detail";

interface PromptDetailContentProps {
  id: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function PromptDetailContent({ id, user }: PromptDetailContentProps) {
  const { data } = useSuspenseQuery({
    ...promptQueries.detail(id),
  });

  const { data: profile } = useUserProfile();
  const nickname = profile?.basicInfo.nickname ?? user?.name ?? "";

  const prompt = data;

  return (
    <div className="flex flex-col gap-8">
      <PostDetail promptId={id} prompt={prompt} user={user} />

      {user ? (
        <CommentForm promptId={id} userIcon={null} userName={nickname} />
      ) : (
        <p className="body-medium text-gray-500 text-center py-4">
          로그인 후 댓글을 작성할 수 있습니다.
        </p>
      )}

      <CommentList
        promptId={id}
        isLoggedIn={!!user}
        currentUserIcon={null}
        currentUserName={nickname}
      />
    </div>
  );
}
