"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.lists(),
      });
      toasts.success("프롬프트가 성공적으로 생성되었습니다!");
      router.push(`/prompt/${data.promptId}`);
    },
    onError: () => {
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
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: promptQueries.detail(id).queryKey,
      });
      toasts.success("프롬프트가 성공적으로 수정되었습니다!");
      router.push(`/prompt/${id}`);
    },
    onError: () => {
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
