import Link from "next/link";
import { Suspense } from "react";

import PromptCardSkeleton from "@/components/prompt/prompt-card-skeleton";
import { BaseButton } from "@/components/shared/button";
import { PageTitleGroup } from "@/components/shared/page-title-group";
import { ProgSidebar } from "@/components/sidebar/category-sidebar";
import { ROUTES } from "@/lib/routes";

import { RANKING_INFO } from "../../constant";
import RankingList from "./RankList";

interface RankingPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function RankPage({ searchParams }: RankingPageProps) {
  const { category = "all" } = await searchParams;
  const { title, desc } =
    RANKING_INFO.get(category) || RANKING_INFO.get("all")!;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 bg-gray-50">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-10">
        <div className="lg:col-start-4 lg:col-span-9 mb-10 col-span-4">
          <PageTitleGroup title={title} subtitle={desc} />
        </div>
      </div>

      <section className="lg:hidden mb-12">
        <Link href={ROUTES.community.WRITE} className="w-full">
          <BaseButton full size="lg">
            글쓰기
          </BaseButton>
        </Link>
      </section>

      <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 items-start">
        {/* 왼쪽: 사이드바 */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24">
          <Link href={ROUTES.community.WRITE} className="w-full">
            <BaseButton full size="lg">
              글쓰기
            </BaseButton>
          </Link>
          <ProgSidebar />
        </aside>

        {/* 오른쪽: 카드 리스트 */}
        <main className="col-span-4 lg:col-span-9 flex flex-col gap-4">
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
        </main>
      </div>
    </div>
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
