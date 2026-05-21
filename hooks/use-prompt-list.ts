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
import { ApiResponse } from "@/lib/fetcher";
import {
  fetchPrompts,
  promptApi,
  PromptListResponse,
} from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getNextPromptPageParam = (lastPage: ApiResponse<PromptPage>) => {
  if (!lastPage || !lastPage.data) return undefined;

  const { isLast, nextPage } = lastPage.data;

  // isLast가 true이면 다음 페이지 없음
  if (isLast) return undefined;

  // nextPage가 null이거나 undefined이면 다음 페이지 없음
  return nextPage ?? undefined;
};

export const useGetPrompts = (category: string, q?: string) => {
  const normalizedQ = q?.trim() || undefined;
  return useInfiniteQuery<
    ApiResponse<PromptPage>,
    Error,
    InfiniteData<ApiResponse<PromptPage>>,
    readonly [string, string, string | undefined],
    number
  >({
    queryKey: ["prompts", category, normalizedQ] as const,
    queryFn: ({ pageParam }) => fetchPrompts(category, pageParam, normalizedQ),
    initialPageParam: 0,
    getNextPageParam: getNextPromptPageParam,
  });
};

const RANK_PAGE_SIZE = 10;

/**
 * 랭킹 페이지용 — 백엔드 /prompts/createDesc 호출 (최신순 + 카테고리 필터).
 * - categoryId === null → "all"로 전체 조회
 * - categoryId === undefined → 아직 매핑 결정 전(또는 매칭 실패). enabled:false로 호출 보류
 * 페이지네이션 메타가 없는 응답이라 totalCount로 다음 페이지 유무 판단.
 */
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
 * /categories 응답의 name과 후보 매핑을 대조해 ID를 도출한다.
 *
 * 반환값:
 * - null: "all" 또는 알 수 없는 슬러그 → 전체 조회로 처리
 * - undefined: 카테고리 응답 로딩 중 (호출 보류 신호)
 * - number: 매칭된 categoryId
 */
export const useCategoryIdFromSlug = (
  slug: string | undefined
): number | null | undefined => {
  const { data: categories, isPending } = useQuery(promptQueries.categories());

  if (!slug || slug === "all") return null;

  const candidates = Object.prototype.hasOwnProperty.call(
    CATEGORY_SLUG_TO_NAME_CANDIDATES,
    slug
  )
    ? CATEGORY_SLUG_TO_NAME_CANDIDATES[
        slug as keyof typeof CATEGORY_SLUG_TO_NAME_CANDIDATES
      ]
    : undefined;
  if (!candidates) return null;

  if (isPending || !categories) return undefined;

  for (const candidate of candidates) {
    const matched = categories.find((c) => c.name === candidate);
    if (matched) return matched.categoryId;
  }

  // 매칭 실패 — 백엔드 카테고리명 변경/미등록 가능성. 전체 조회로 폴백.
  // eslint-disable-next-line no-console
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
      isLiked,
    }: {
      promptId: string;
      isLiked: boolean;
    }) => {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(`${BASE_URL}/prompts/like/${promptId}`, {
        method,
      });
      if (!response.ok) throw new Error("좋아요 처리 중 에러가 발생했습니다.");
      if (response.status === 204) return null;
      return response.json();
    },

    onMutate: async ({ promptId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["prompts"] });

      const previousPrompts = queryClient.getQueriesData<
        InfiniteData<PromptPage>
      >({
        queryKey: ["prompts"],
      });

      queryClient.setQueriesData<InfiniteData<PromptPage>>(
        { queryKey: ["prompts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: PromptPage) => ({
              ...page,
              items: page.items.map((item: PromptBase) =>
                item.id === promptId
                  ? {
                      ...item,
                      isLiked: !isLiked,
                      likes: isLiked
                        ? Math.max((item.likes ?? 0) - 1, 0)
                        : (item.likes ?? 0) + 1,
                    }
                  : item
              ),
            })),
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
      toasts.success("좋아요 처리에 실패했습니다.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
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
      const response = await fetch(`${BASE_URL}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || "신고 실패");
      }
      return result;
    },
    onSuccess: () => {
      toasts.success("신고가 정상적으로 접수되었습니다.");
    },
    onError: (error: Error) => {
      toasts.success(error.message);
    },
  });
};
