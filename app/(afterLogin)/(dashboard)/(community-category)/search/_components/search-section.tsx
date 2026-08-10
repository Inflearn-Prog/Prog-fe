"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import useQueryParams from "@/app/hooks/use-query-params";
import { PromptBase } from "@/app/types/type";
import { SearchTitle } from "@/components/search/search-title";
import { useGetPrompts } from "@/hooks/use-prompt-list";

import { CommunityPromptItem } from "../../../_types/community-type";
import { CommunitySection } from "../../_components/community";
import { SortGroup } from "../../_components/sort-group";
import SearchForm from "./search-form";

export function SearchSection({ q: initialQ }: { q?: string }) {
  const { getParam } = useQueryParams();
  const currentSearch = getParam("q") || initialQ || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetPrompts("all", currentSearch);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const totalItems = data?.pages?.[0]?.data?.totalCount ?? 0;

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
          commentCount: item.commentCount || 0,
          copyCount: Number(item.copyCount || 0),
          authorNickname: item.nickname || item.userName || "익명",
          createdAt: item.createdAt ?? null,
        })) ?? []
    ) ?? [];

  return (
    <div className="w-full">
      <SearchForm />

      <div className="flex items-start justify-between mt-15.5 gap-x-10">
        <SearchTitle search={currentSearch} searchLength={totalItems} />
        <SortGroup />
      </div>

      <div className="mt-8">
        {/* 3. 로딩 상태일 때 데이터 접근을 막음 */}
        {isPending ? (
          <div className="py-20 text-center">결과를 불러오는 중...</div>
        ) : (
          <>
            <CommunitySection
              prompts={allPrompts}
              isLoading={isFetchingNextPage}
            />

            <div
              ref={ref}
              className="h-20 w-full flex justify-center items-center"
            >
              {isFetchingNextPage && <div className="loader" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
