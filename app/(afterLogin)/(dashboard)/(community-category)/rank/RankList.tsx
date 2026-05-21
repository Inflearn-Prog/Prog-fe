"use client";

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
  useCategoryIdFromSlug,
  useGetPromptsLatest,
  useReportMutation,
  useToggleLikeMutation,
} from "@/hooks/use-prompt-list";

export interface PromptInfo extends PromptBase {
  rank?: number;
  bookmarks?: number;
}

interface ApiPromptItem {
  promptId?: number;
  id?: string;
  userId?: number;
  nickname?: string;
  userName?: string;
  userIcon?: string;
  userDesc?: string;
  category?: { categoryId: number; name: string; description: string } | string;
  title?: string;
  content?: string;
  isLiked?: boolean;
  likes?: number;
  createdAt?: string;
}

function toPromptInfo(raw: ApiPromptItem): PromptInfo {
  return {
    id: raw.id ?? String(raw.promptId ?? ""),
    category:
      typeof raw.category === "object"
        ? (raw.category?.name ?? "")
        : (raw.category ?? ""),
    title: raw.title ?? "",
    content: raw.content ?? "",
    userName: raw.userName ?? raw.nickname ?? "",
    userIcon: raw.userIcon ?? "",
    userDesc: raw.userDesc ?? "",
    isLiked: raw.isLiked ?? false,
    likes: raw.likes ?? 0,
    createdAt: raw.createdAt,
  };
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

  const [report, setReport] = useState<ReportState>(INITIAL_REPORT_STATE);

  const closeReportModal = () => setReport(INITIAL_REPORT_STATE);

  const handleLike = (promptId: string, isLiked: boolean) => {
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
  const categoryId = useCategoryIdFromSlug(category);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPromptsLatest(categoryId);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPrompts =
    data?.pages?.flatMap(
      (page) =>
        (page?.data?.prompts ?? []).map((item) =>
          toPromptInfo(item as ApiPromptItem)
        ) ?? []
    ) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {allPrompts?.map((prompt: PromptInfo) => (
        <PromptCard
          key={prompt.id}
          {...prompt}
          isLiked={!!prompt.isLiked}
          onLike={handleLike}
          onCopy={() => handleCopy(prompt.content)}
          onReport={() =>
            setReport((prev) => ({ ...prev, targetId: prompt.id }))
          }
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
