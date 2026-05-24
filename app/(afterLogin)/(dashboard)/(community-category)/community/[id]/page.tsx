import Link from "next/link";
import { Suspense } from "react";

import { PostDetailSkeleton } from "@/app/(afterLogin)/prompt/[id]/_components/post-detail-skeleton";
import { PromptDetailContent } from "@/app/(afterLogin)/prompt/[id]/_components/prompt-detail-content";
import { PromptErrorBoundary } from "@/app/(afterLogin)/prompt/[id]/_components/prompt-error-boundary";
import { BaseButton } from "@/components/shared/button";
import { ProgSidebar } from "@/components/sidebar/category-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

interface PageProps {
  params: Promise<{ id: string }>;
}

function CommunityDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <PostDetailSkeleton />

      <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex flex-col gap-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="flex justify-end">
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex gap-4"
          >
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CommunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 bg-gray-50">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-start">
        {/* 왼쪽: 글쓰기 버튼 + 카테고리 사이드바 */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4 pt-29.5">
          {user && (
            <BaseButton asChild full size="lg">
              <Link href={ROUTES.prompt.WRITE}>글쓰기</Link>
            </BaseButton>
          )}
          <Suspense>
            <ProgSidebar />
          </Suspense>
        </aside>

        {/* 오른쪽: 게시글 상세 + 댓글 */}
        <main className="col-span-4 lg:col-span-9">
          <PromptErrorBoundary>
            <Suspense fallback={<CommunityDetailSkeleton />}>
              <PromptDetailContent id={id} user={user} />
            </Suspense>
          </PromptErrorBoundary>
        </main>
      </div>
    </div>
  );
}
