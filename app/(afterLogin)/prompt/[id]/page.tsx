import Link from "next/link";
import { notFound } from "next/navigation";

import { BaseButton } from "@/components/shared/button";
import { ProgSidebar } from "@/components/sidebar/category-sidebar";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { promptApi } from "@/queries/api/prompts";

import { CommentForm } from "./_components/comment-form";
import { CommentList } from "./_components/comment-list";
import { PostDetail } from "./_components/post-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 세션 및 게시글 상세 데이터 병렬 조회
  const [session, promptResult] = await Promise.allSettled([
    auth(),
    promptApi.getPromptDetail(id),
  ]);

  // 게시글 데이터 확인 (없으면 404)
  if (promptResult.status === "rejected") {
    notFound();
  }

  const prompt = promptResult.value.data;
  const user = session.status === "fulfilled" ? session.value?.user : undefined;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 bg-gray-50">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-start">
        {/* 왼쪽: 글쓰기 버튼 + 카테고리 사이드바 */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4">
          {user && (
            <BaseButton asChild full size="lg">
              <Link href={ROUTES.prompt.WRITE}>글쓰기</Link>
            </BaseButton>
          )}
          <ProgSidebar />
        </aside>

        {/* 오른쪽: 게시글 상세 + 댓글 */}
        <main className="col-span-4 lg:col-span-9 flex flex-col gap-8">
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
        </main>
      </div>
    </div>
  );
}
