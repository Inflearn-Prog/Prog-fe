import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { PromptBase, PromptPage } from "@/app/types/type";
import { toasts } from "@/components/shared/toast";
import { ApiResponse, fetcher } from "@/lib/fetcher";
import {
  fetchLikePrompts,
  fetchPrompts,
  fetchSearchPrompts,
} from "@/queries/api/prompts";

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
    return allPages.length; // Next page index (0-based)
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
        return fetchLikePrompts(pageParam);
      }
      return fetchPrompts(category, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: getNextPromptPageParam,
    enabled: sort !== "hot",
  });
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
    // 💡 에러 타입을 Error로 지정하여 any 에러를 완벽히 해결합니다.
    onError: (error: Error) => {
      toasts.error(error.message || "신고 처리에 실패했습니다.");
    },
  });
};
