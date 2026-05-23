"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useQueryParams from "@/app/hooks/use-query-params";
import { PromptBase } from "@/app/types/type";
import { useGetPrompts } from "@/hooks/use-prompt-list";

import { CommunityPromptItem } from "../../_types/community-type";
import { CommunitySection } from "../_components/community";
import { SortGroup } from "../_components/sort-group";

export function CommunityListSection() {
  const { getParam } = useQueryParams();
  const category = getParam("category") || "all";
  const sort = (getParam("sort") as "latest" | "popular") || "latest";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetPrompts(
      category,
      undefined,
      sort === "popular" ? "likes" : undefined
    );

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
          likeCount: item.likes || 0,
          copyCount: Number(item.copyCount || 0),
          authorNickname: item.userName || item.nickname || "익명",
          createdAt: item.createdAt || new Date().toISOString(),
        })) ?? []
    ) ?? [];

  return (
    <div className="w-full">
      {/* 정렬 버튼 */}
      <div className="flex justify-end">
        <SortGroup />
      </div>

      {/* 게시글 목록 */}
      {isPending ? (
        <div className="py-20 text-center text-gray-500">불러오는 중...</div>
      ) : (
        <>
          <CommunitySection
            prompts={allPrompts}
            isLoading={isFetchingNextPage}
          />

          {/* 무한 스크롤 트리거 */}
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
