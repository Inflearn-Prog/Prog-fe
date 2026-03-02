// 2026-02-27 rank/page.tsx
// Next.js page는 searchParams를 props로 받을 수 있습니다.
// 참고: https://nextjs.org/docs/app/api-reference/file-conventions/page

import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RANKING_INFO } from "@/app/(afterLogin)/constant";
import PromptCardSkeleton from "@/components/prompt/prompt-card-skeleton";
import { PageTitleGroup } from "@/components/shared/page-title-group";

import RankingList from "./RankList";
import RankSelectBar from "./RankSelectBar";

interface RankingPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RankPage({ searchParams }: RankingPageProps) {
  const { category = "all" } = await searchParams;

  // 유효하지 않은 카테고리는 404 처리
  if (category !== "all" && !RANKING_INFO.has(category)) {
    notFound();
  }

  const { title, desc } = RANKING_INFO.get(category)!;
  return (
    <>
      <PageTitleGroup title={title} subtitle={desc} />
      <div className="lg:hidden">
        <RankSelectBar defaultValue={category} />
      </div>
      <Suspense
        key={category}
        fallback={
          <div className="flex flex-col gap-4">
            {[...Array(10)].map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <RankingList category={category} />
      </Suspense>
    </>
  );
}

/**
 * search params
 * category
 * - development
 * - marketing_content
 * - service_planning
 * - hr_general_affairs
 * - design
 */
