"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import PromptCard from "@/components/prompt/prompt-card";
import PromptCardSkeleton from "@/components/prompt/prompt-card-skeleton";
import ReportModal from "@/components/prompt/report-modal";
import { toasts } from "@/components/shared/toast";
import {
  useGetPrompts,
  useReportMutation,
  useToggleLikeMutation,
} from "@/hooks/use-prompt-list";

export interface Prompt {
  id: string;
  category: string;
  title: string;
  content: string;
  userIcon: string;
  userName: string;
  userDesc: string;
  rank?: number;
  likes?: number;
  isLiked?: boolean;
  bookmarks?: number;
}

const handleCopy = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);

    toasts.success("프롬프트가 클립보드에 복사되었습니다!");
  } catch (error) {
    alert("복사에 실패했습니다. 다시 시도해주세요.");
  }
};

export default function RankingList({ category }: { category: string }) {
  const { mutate } = useToggleLikeMutation();
  const { mutate: reportMutate } = useReportMutation();
  const { ref, inView } = useInView();

  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportDetail, setReportDetail] = useState<string>("");

  const closeReportModal = () => {
    setReportTargetId(null);
    setReportReason("");
    setReportDetail("");
  };

  const handleLike = (promptId: string, isLiked: boolean) => {
    mutate({ promptId, isLiked });
  };

  const handleReport = () => {
    if (!reportTargetId) return;

    reportMutate(
      {
        targetType: "PROMPT",
        targetId: reportTargetId,
        reason: reportReason,
        reasonDetail: reportReason === "OTHER" ? reportDetail : "",
      },
      {
        onSuccess: () => closeReportModal(),
      }
    );
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPrompts(category);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPrompts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {allPrompts?.map((prompt: Prompt) => (
        <PromptCard
          key={prompt.id}
          {...prompt}
          isLiked={!!prompt.isLiked}
          onLike={handleLike}
          onCopy={() => handleCopy(prompt.content)}
          onReport={() => setReportTargetId(prompt.id)}
        />
      ))}
      <div ref={ref} className="flex flex-col gap-4">
        {isFetchingNextPage && (
          <>
            <PromptCardSkeleton />
            <PromptCardSkeleton />
            <PromptCardSkeleton />
          </>
        )}
      </div>
      {reportTargetId && (
        <Dialog.Root
          open={!!reportTargetId}
          onOpenChange={(open) => !open && closeReportModal()}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] lg:max-w-[640px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-10 shadow-lg"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Dialog.Title className="sr-only">신고하기</Dialog.Title>
              <Dialog.Description className="sr-only">
                해당 프롬프트의 부적절한 내용을 신고하는 창입니다.
              </Dialog.Description>

              <ReportModal
                title="어떤 문제가 있나요?"
                reason={reportReason}
                reasonDetail={reportDetail}
                onSelect={(val) => setReportReason(val)}
                onOtherChange={(val) => setReportDetail(val)}
                onCancel={closeReportModal}
                onReport={handleReport}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
