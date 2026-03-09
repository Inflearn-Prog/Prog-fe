"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toasts } from "@/components/shared/toast";
import { promptQueries } from "@/queries/options/prompt-query";

export default function usePromptQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promptQueries.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.lists(),
      });
      toasts.success("프롬프트가 성공적으로 생성되었습니다!");
    },
    onError: (error) => {
      // 프롬프트 생성 실패 시 에러 처리
      console.error("프롬프트 생성 실패:", error);
    },
  });
}
