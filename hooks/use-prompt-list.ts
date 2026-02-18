import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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

      if (!response.ok) {
        throw new Error("좋아요 처리 중 에러가 발생했습니다.");
      }

      return response.json();
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
      alert("신고가 정상적으로 접수되었습니다.");
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });
};
