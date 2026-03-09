"use client";
// 2024-11-23 - /app/(afterLogin)/prompt/hook/use-prompt-query.tsx
// 공식 문서: https://tanstack.com/query/latest/docs/react/overview
import { useMutation, useQueryClient } from "@tanstack/react-query";
// 공식 문서: https://nextjs.org/docs/app/api-reference/functions/use-router
import { useRouter } from "next/navigation";

import { toasts } from "@/components/shared/toast";
import {
  PromptCreateRequest,
  PromptUpdateRequest,
} from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

export default function usePromptQuery() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: (data: PromptCreateRequest) => promptQueries.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.lists(),
      });
      toasts.success("프롬프트가 성공적으로 생성되었습니다!");
      router.push("/prompt");
    },
    onError: (error) => {
      console.error("프롬프트 생성 실패:", error);
      toasts.error("프롬프트 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: PromptUpdateRequest;
    }) => promptQueries.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: promptQueries.detail(data.promptId).queryKey,
      });
      toasts.success("프롬프트가 성공적으로 수정되었습니다!");
      router.push(`/prompt/${data.promptId}`);
    },
    onError: (error) => {
      console.error("프롬프트 수정 실패:", error);
      toasts.error("프롬프트 수정에 실패했습니다.");
    },
  });

  return {
    createPrompt: createMutation.mutate,
    updatePrompt: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
