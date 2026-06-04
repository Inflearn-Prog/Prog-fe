"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Siren, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { QuillHtmlViewer } from "@/components/board/QuillHtmlViewer";
import { ProfIcon } from "@/components/profile-icon/profile-icon";
import ReportModal from "@/components/prompt/report-modal";
import { BaseButton } from "@/components/shared/button";
import { toasts } from "@/components/shared/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReportMutation } from "@/hooks/use-prompt-list";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { promptApi, PromptResponse } from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

import { formatCommentDate } from "./utils";

interface PostDetailProps {
  promptId: string | number;
  prompt: PromptResponse;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

function AuthorProfileCard({
  userName,
  userIcon,
  userDesc,
}: {
  userName: string;
  userIcon: string | null;
  userDesc: string | null;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex gap-5 items-end">
      <ProfIcon
        src={userIcon}
        width={88}
        height={88}
        alt={userName}
        fallback={userName || "U"}
      />
      <div className="flex flex-1 flex-col gap-1">
        <p className="heading-small text-gray-900">{userName}</p>
        <p className="body-medium text-gray-500">
          {userDesc ?? "소개가 없습니다."}
        </p>
      </div>
    </div>
  );
}

export function PostDetail({ promptId, prompt, user }: PostDetailProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(prompt.isLiked);
  const [likesCount, setLikesCount] = useState(prompt.likes);
  const [report, setReport] = useState({ open: false, reason: "", detail: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: reportMutate } = useReportMutation();

  const isOwner =
    !!user?.id && String(user.id) === String(prompt.userId);

  const categoryLabel = prompt.category.name;

  const { mutate: toggleLike } = useMutation({
    mutationFn: (_vars: { currentlyLiked: boolean }) =>
      promptQueries.toggleLike(promptId),
    onMutate: ({ currentlyLiked }) => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) =>
        currentlyLiked ? Math.max(prev - 1, 0) : prev + 1
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: promptQueries.detail(promptId).queryKey,
      });
    },
    onError: (_, { currentlyLiked }) => {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) =>
        currentlyLiked ? prev + 1 : Math.max(prev - 1, 0)
      );
    },
  });

  const { mutate: deletePrompt, isPending: isDeleting } = useMutation({
    mutationFn: () => promptApi.deletePrompt(promptId),
    onSuccess: () => {
      toasts.success("게시글이 삭제되었습니다.");
      router.push(ROUTES.community.ROOT);
    },
    onError: () => {
      toasts.error("게시글 삭제에 실패했습니다.");
    },
  });

  const handleCopy = useCallback(async () => {
    try {
      const el = document.createElement("div");
      el.innerHTML = prompt.content;
      const plainText = el.textContent ?? "";
      await navigator.clipboard.writeText(plainText);
      toasts.success("프롬프트가 복사되었습니다.");
    } catch {
      toasts.error("클립보드 복사에 실패했습니다.");
    }
  }, [prompt.content]);

  const handleLikeClick = useCallback(() => {
    if (!user) {
      toasts.error("로그인 후 이용할 수 있습니다.");
      return;
    }
    toggleLike({ currentlyLiked: isLiked });
  }, [user, toggleLike, isLiked]);

  const handleReportClick = useCallback(() => {
    if (!user) {
      toasts.error("로그인 후 이용할 수 있습니다.");
      return;
    }
    setReport({ open: true, reason: "", detail: "" });
  }, [user]);

  const closeReportModal = useCallback(() => {
    setReport({ open: false, reason: "", detail: "" });
  }, []);

  const handleReportSubmit = useCallback(() => {
    reportMutate(
      {
        targetType: "PROMPT",
        targetId: String(promptId),
        reason: report.reason,
        reasonDetail: report.reason === "OTHER" ? report.detail : "",
      },
      { onSuccess: closeReportModal }
    );
  }, [reportMutate, promptId, report.reason, report.detail, closeReportModal]);

  const handleEditClick = useCallback(() => {
    router.push(ROUTES.prompt.EDIT(String(promptId)));
  }, [router, promptId]);

  const handleDeleteClick = useCallback(() => {
    setDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    setDeleteConfirm(false);
    deletePrompt();
  }, [deletePrompt]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <AuthorProfileCard
        userName={prompt.userName}
        userIcon={prompt.userIcon}
        userDesc={prompt.userDesc}
      />

      <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <span className="px-2.5 py-1 label-small font-semibold text-frog-600 bg-frog-100 rounded-5">
            {categoryLabel}
          </span>
          <span className="label-small text-gray-900">
            {formatCommentDate(prompt.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="heading-medium text-gray-900">{prompt.title}</h1>
            <QuillHtmlViewer
              html={prompt.content}
              className="body-medium text-gray-900"
            />
          </div>

          <div className="flex items-end justify-between">
            <BaseButton
              size="sm"
              shape="round"
              onClick={handleCopy}
              className="px-4 py-1 h-7"
            >
              복사
            </BaseButton>

            {isOwner ? (
              <div className="flex gap-2 items-center">
                <BaseButton
                  size="sm"
                  variant="outline"
                  onClick={handleEditClick}
                  className="px-4 py-1 h-7"
                >
                  수정
                </BaseButton>
                <BaseButton
                  size="sm"
                  variant="outline"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="px-4 py-1 h-7 text-red-600 border-red-200 hover:bg-red-50"
                >
                  삭제
                </BaseButton>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  aria-label="좋아요"
                  onClick={handleLikeClick}
                  className={cn(
                    "flex items-center gap-1 hover:opacity-70 transition-300",
                    isLiked ? "text-frog-600" : "text-gray-700"
                  )}
                >
                  <ThumbsUp size={20} fill="currentColor" strokeWidth={0} />
                  <span className="label-small">{likesCount}</span>
                </button>
                <button
                  type="button"
                  aria-label="신고"
                  onClick={handleReportClick}
                  className="hover:opacity-70 transition-300 text-gray-700"
                >
                  <Siren size={20} fill="currentColor" strokeWidth={0} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 신고 모달 */}
      <Dialog
        open={report.open}
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
            onSelect={(val) => setReport((prev) => ({ ...prev, reason: val }))}
            onOtherChange={(val) =>
              setReport((prev) => ({ ...prev, detail: val }))
            }
            onCancel={closeReportModal}
            onReport={handleReportSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 모달 */}
      <Dialog
        open={deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(false)}
      >
        <DialogContent
          className="max-w-[400px] p-6 rounded-[10px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>
              삭제된 게시글은 복구할 수 없습니다. 정말 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirm(false)}
            >
              취소
            </BaseButton>
            <BaseButton
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              삭제
            </BaseButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
