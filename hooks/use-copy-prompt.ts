"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { toasts } from "@/components/shared/toast";
import { htmlToPlainText } from "@/lib/utils";
import { promptQueries } from "@/queries/options/prompt-query";

export function useCopyPrompt() {
  const queryClient = useQueryClient();

  const write = useCallback(async (content: string) => {
    const plainText = htmlToPlainText(content);
    if (!plainText) {
      toasts.error("복사할 내용이 없습니다.");
      return;
    }
    await navigator.clipboard.writeText(plainText);
    toasts.success("프롬프트가 복사되었습니다.");
  }, []);

  const copyContent = useCallback(
    async (content: string) => {
      try {
        await write(content);
      } catch {
        toasts.error("클립보드 복사에 실패했습니다.");
      }
    },
    [write]
  );

  const copyById = useCallback(
    async (promptId: number) => {
      try {
        const detail = await queryClient.fetchQuery(
          promptQueries.detail(promptId)
        );
        await write(detail?.content ?? "");
      } catch {
        toasts.error("클립보드 복사에 실패했습니다.");
      }
    },
    [queryClient, write]
  );

  return { copyContent, copyById };
}
