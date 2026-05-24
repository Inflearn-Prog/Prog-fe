import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { PromptBase, PromptPage } from "@/app/types/type";
import { toasts } from "@/components/shared/toast";
import { CATEGORY_SLUG_TO_NAME_CANDIDATES } from "@/components/sidebar/constant";
import { ApiResponse, fetcher } from "@/lib/fetcher";
import {
  fetchLikePrompts,
  fetchPrompts,
  fetchSearchPrompts,
  promptApi,
  PromptListResponse,
} from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

export const getNextPromptPageParam = (
  lastPage: ApiResponse<PromptPage>,
  allPages: ApiResponse<PromptPage>[]
) => {
  if (!lastPage || !lastPage.data) return undefined;

  const { prompts, totalCount } = lastPage.data;
  const currentTotal = allPages.reduce(
    (acc, page) => acc + (page.data?.prompts.length ?? 0),
    0
  );

  if (currentTotal < totalCount) {
    return allPages.length;
  }

  return undefined;
};

export const useGetPrompts = (
  category: string = "all",
  q?: string,
  sort: "latest" | "likes" | "hot" = "latest"
) => {
  const normalizedQ = q?.trim() || undefined;

  return useInfiniteQuery({
    queryKey: ["prompts", category, normalizedQ, sort] as const,
    queryFn: ({ pageParam }) => {
      if (normalizedQ) {
        return fetchSearchPrompts(normalizedQ, pageParam);
      }
      if (sort === "likes") {
        return fetchLikePrompts(category, pageParam);
      }
      return fetchPrompts(category, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: getNextPromptPageParam,
    enabled: sort !== "hot",
  });
};

const RANK_PAGE_SIZE = 10;

export const useGetPromptsLatest = (categoryId: number | null | undefined) => {
  const enabled = categoryId !== undefined;
  return useInfiniteQuery<
    ApiResponse<PromptListResponse>,
    Error,
    InfiniteData<ApiResponse<PromptListResponse>>,
    readonly [string, "createDesc", number | "all"],
    number
  >({
    queryKey: ["prompts", "createDesc", categoryId ?? "all"] as const,
    queryFn: ({ pageParam }) =>
      promptApi.getPromptsLatest({
        page: pageParam,
        size: RANK_PAGE_SIZE,
        category: categoryId ?? "all",
      }),
    initialPageParam: 0,
    enabled,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage?.data?.totalCount ?? 0;
      const loaded = allPages.reduce(
        (acc, p) => acc + (p?.data?.prompts?.length ?? 0),
        0
      );
      return loaded < totalCount ? allPages.length : undefined;
    },
  });
};

/**
 * 슬러그를 백엔드 categoryId로 동적 변환.
 *
 * slug가 없거나 "all"이면 /categories 호출 자체를 스킵.
 *
 * 반환값:
 * - null     : "all" 또는 알 수 없는 슬러그 → 전체 조회로 처리
 * - undefined: 카테고리 응답 로딩 중 (호출 보류 신호)
 * - number   : 매칭된 categoryId
 */
export const useCategoryIdFromSlug = (
  slug: string | undefined
): number | null | undefined => {
  // slug가 없거나 "all"이면 카테고리 목록 조회 불필요
  const needsLookup = !!slug && slug !== "all";

  const { data: categories, isPending } = useQuery({
    ...promptQueries.categories(),
    enabled: needsLookup, // ← "all" 또는 slug 없을 때 /categories 호출 스킵
  });

  if (!needsLookup) return null;

  const candidates = Object.prototype.hasOwnProperty.call(
    CATEGORY_SLUG_TO_NAME_CANDIDATES,
    slug!
  )
    ? CATEGORY_SLUG_TO_NAME_CANDIDATES[
        slug! as keyof typeof CATEGORY_SLUG_TO_NAME_CANDIDATES
      ]
    : undefined;

  if (!candidates) return null;

  if (isPending || !categories) return undefined;

  for (const candidate of candidates) {
    const matched = categories.find((c) => c.name === candidate);
    if (matched) return matched.categoryId;
  }

  console.warn(
    `[useCategoryIdFromSlug] '${slug}' 매칭 실패. 후보: ${candidates.join(", ")} / 응답: ${categories.map((c) => c.name).join(", ")}`
  );
  return null;
};

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      promptId,
    }: {
      promptId: number;
      isLiked: boolean;
    }) => {
      const response = await fetcher.post(`prompts/${promptId}/like`);
      return response.json();
    },

    onMutate: async ({ promptId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["prompts"] });

      const previousPrompts = queryClient.getQueriesData<
        InfiniteData<ApiResponse<PromptPage>>
      >({
        queryKey: ["prompts"],
      });
      queryClient.setQueriesData<InfiniteData<ApiResponse<PromptPage>>>(
        { queryKey: ["prompts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              if (!page.data) return page;
              return {
                ...page,
                data: {
                  ...page.data,
                  prompts: page.data.prompts.map((item: PromptBase) =>
                    item.promptId === promptId
                      ? {
                          ...item,
                          isLiked: !isLiked,
                          likes: isLiked
                            ? Math.max((item.likes ?? 0) - 1, 0)
                            : (item.likes ?? 0) + 1,
                        }
                      : item
                  ),
                },
              };
            }),
          };
        }
      );

      return { previousPrompts };
    },
    onError: (err, newLike, context) => {
      if (context?.previousPrompts) {
        context.previousPrompts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toasts.error("좋아요 처리에 실패했습니다.");
    },
    onSuccess: (data, variables) => {
      if (variables.isLiked) {
        toasts.success("좋아요가 취소되었습니다.");
      } else {
        toasts.success("좋아요가 정상적으로 처리되었습니다.");
      }
    },
  });
};

interface ReportRequest {
  targetType: "PROMPT" | "COMMENT";
  targetId: string;
  reason: string;
  reasonDetail: string;
}

export const useReportMutation = () => {
  return useMutation({
    mutationFn: async (reportData: ReportRequest) => {
      const response = await fetcher.post("reports", {
        json: {
          ...reportData,
          targetId: Number(reportData.targetId),
        },
      });

      return response.json();
    },
    onSuccess: () => {
      toasts.success("신고가 정상적으로 접수되었습니다.");
    },
    onError: (error: Error) => {
      toasts.error(error.message || "신고 처리에 실패했습니다.");
    },
  });
};
