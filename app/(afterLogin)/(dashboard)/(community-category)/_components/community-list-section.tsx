"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useQueryParams from "@/app/hooks/use-query-params";
import { PromptBase } from "@/app/types/type";
import { CATEGORY_SLUG_TO_ID } from "@/components/sidebar/constant";
import { useGetPrompts } from "@/hooks/use-prompt-list";

import { CommunityPromptItem } from "../../_types/community-type";
import { CommunitySection } from "../_components/community";
import { SortGroup, SortType } from "../_components/sort-group";

/** 슬러그 → categoryId 변환. 매핑 없으면 "all" 반환 */
export function resolveCategoryParam(slug: string): string {
  if (!slug || slug === "all") return "all";
  const slugToIdMap = new Map<string, number>(
    Object.entries(CATEGORY_SLUG_TO_ID)
  );
  const id = slugToIdMap.get(slug);

  return id !== undefined ? String(id) : "all";
}

export function CommunityListSection() {
  const { getParam } = useQueryParams();
  const categorySlug = getParam("category") || "all";
  const rawSort = getParam("sort");
  const sort: SortType = rawSort === "popular" ? "popular" : "latest";
  const isPopular = sort === "popular";

  // 슬러그 → "1", "2" ... 또는 "all"
  // 인기순(/prompts/likeDesc)은 category 파라미터 없으므로 "all" 고정
  const categoryParam = isPopular ? "all" : resolveCategoryParam(categorySlug);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetPrompts(categoryParam, undefined, isPopular ? "likes" : "latest");

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPrompts: CommunityPromptItem[] =
    data?.pages?.flatMap(
      (page) =>
        page?.data?.prompts?.map((item: PromptBase) => ({
          id: item.promptId,
          title: item.title,
          preview: item.contentSummary || "",
          jobCategory: (item.category?.name ||
            "ETC") as CommunityPromptItem["jobCategory"],
          likeCount: item.likeCount || 0,
          copyCount: Number(item.copyCount || 0),
          authorNickname: item.userName || item.nickname || "익명",
          createdAt: item.createdAt ?? null,
        })) ?? []
    ) ?? [];

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <SortGroup />
      </div>

      {isPending ? (
        <div className="py-20 text-center text-gray-500">불러오는 중...</div>
      ) : (
        <>
          <CommunitySection
            prompts={allPrompts}
            isLoading={isFetchingNextPage}
          />

          <div
            ref={ref}
            className="h-10 w-full flex justify-center items-center"
          >
            {isFetchingNextPage && (
              <div className="text-sm text-gray-400">불러오는 중...</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
