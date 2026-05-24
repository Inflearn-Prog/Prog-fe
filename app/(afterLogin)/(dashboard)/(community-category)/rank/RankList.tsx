"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { PromptBase } from "@/app/types/type";
import PromptCard from "@/components/prompt/prompt-card";
import PromptCardSkeleton from "@/components/prompt/prompt-card-skeleton";
import ReportModal from "@/components/prompt/report-modal";
import { toasts } from "@/components/shared/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetPrompts,
  useReportMutation,
  useToggleLikeMutation,
} from "@/hooks/use-prompt-list";
import { ROUTES } from "@/lib/routes";

import { resolveCategoryParam } from "../_components/community-list-section";

export interface PromptInfo extends PromptBase {
  rank?: number;
  bookmarks?: number;
}

const handleCopy = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
    toasts.success("프롬프트가 클립보드에 복사되었습니다!");
  } catch {
    alert("복사에 실패했습니다. 다시 시도해주세요.");
  }
};

export default function RankingList({ category }: { category: string }) {
  const { mutate } = useToggleLikeMutation();
  const { mutate: reportMutate } = useReportMutation();
  const { ref, inView } = useInView();

  interface ReportState {
    targetId: string | null;
    reason: string;
    detail: string;
  }
  const INITIAL_REPORT_STATE: ReportState = {
    targetId: null,
    reason: "",
    detail: "",
  };

  const categorySlug = resolveCategoryParam(category);
  const [report, setReport] = useState<ReportState>(INITIAL_REPORT_STATE);

  const closeReportModal = () => setReport(INITIAL_REPORT_STATE);

  const handleLike = (promptId: number, isLiked: boolean) => {
    mutate({ promptId, isLiked });
  };

  const handleReport = () => {
    if (!report.targetId) return;

    reportMutate(
      {
        targetType: "PROMPT",
        targetId: report.targetId,
        reason: report.reason,
        reasonDetail: report.reason === "OTHER" ? report.detail : "",
      },
      {
        onSuccess: () => closeReportModal(),
      }
    );
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPrompts(categorySlug, undefined, "likes");

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPrompts =
    data?.pages.flatMap((page) => page.data?.prompts ?? []) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {allPrompts?.map((prompt: PromptInfo) => (
        <Link
          key={prompt.promptId}
          href={ROUTES.prompt.DETAIL(prompt.promptId.toString())}
          className="block cursor-pointer"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) {
              e.preventDefault();
            }
          }}
        >
          <PromptCard
            {...prompt}
            isLiked={!!prompt.isLiked}
            onLike={handleLike}
            onCopy={() => handleCopy(prompt.contentSummary || "")}
            onReport={() =>
              setReport((prev) => ({
                ...prev,
                targetId: prompt.promptId.toString(),
              }))
            }
          />
        </Link>
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
      {report.targetId && (
        <Dialog
          open={!!report.targetId}
          onOpenChange={(open) => !open && closeReportModal()}
        >
          <DialogContent
            className="max-w-[400px] lg:max-w-[640px] p-6 rounded-[10px]"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>신고하기</DialogTitle>
              <DialogDescription>
                해당 프롬프트의 부적절한 내용을 신고하는 창입니다.
              </DialogDescription>
            </DialogHeader>

            <ReportModal
              title="어떤 문제가 있나요?"
              reason={report.reason}
              reasonDetail={report.detail}
              onSelect={(val) =>
                setReport((prev) => ({ ...prev, reason: val }))
              }
              onOtherChange={(val) =>
                setReport((prev) => ({ ...prev, detail: val }))
              }
              onCancel={closeReportModal}
              onReport={handleReport}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
