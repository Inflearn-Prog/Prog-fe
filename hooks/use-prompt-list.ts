import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Prompt, PromptPage } from "@/app/types/type";
import { toasts } from "@/components/shared/toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8080";

export const useGetPrompts = (category: string) => {
  return useInfiniteQuery({
    queryKey: ["prompts", category],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${BASE_URL}/api/prompts?category=${category}&page=${pageParam}&size=10`
      );
      if (!response.ok) throw new Error("Network error");
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
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
      const response = await fetch(`${BASE_URL}/api/prompts/like/${promptId}`, {
        method,
      });
      if (!response.ok) throw new Error("좋아요 처리 중 에러가 발생했습니다.");
      return response.json();
    },

    onMutate: async ({ promptId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["prompts"] });

      const previousPrompts = queryClient.getQueryData<
        InfiniteData<PromptPage>
      >(["prompts"]);
      queryClient.setQueryData<InfiniteData<PromptPage>>(["prompts"], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: PromptPage) => ({
            ...page,
            items: page.items.map((item: Prompt) =>
              item.id === promptId
                ? {
                    ...item,
                    isLiked: !isLiked,
                  }
                : item
            ),
          })),
        };
      });

      return { previousPrompts };
    },
    onError: (err, newLike, context) => {
      if (context?.previousPrompts) {
        queryClient.setQueryData(["prompts"], context.previousPrompts);
      }
      toasts.success("좋아요 처리에 실패했습니다.");
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
      const response = await fetch(`${BASE_URL}/api/reports`, {
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
