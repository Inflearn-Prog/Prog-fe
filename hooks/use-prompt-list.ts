import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { PromptBase, PromptPage } from "@/app/types/type";
import { toasts } from "@/components/shared/toast";
import { ApiResponse } from "@/lib/fetcher";
import { fetchPrompts } from "@/queries/api/prompts";

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
