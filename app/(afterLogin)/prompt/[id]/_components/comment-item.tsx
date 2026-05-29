"use client";

import { Reply, Siren } from "lucide-react";
import { useCallback, useState } from "react";

import { ProfIcon } from "@/components/profile-icon/profile-icon";
import ReportModal from "@/components/prompt/report-modal";
import { toasts } from "@/components/shared/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReportMutation } from "@/hooks/use-prompt-list";
import { PromptCommentResponse } from "@/queries/api/prompts";

import { CommentForm } from "./comment-form";
import { formatCommentDate } from "./utils";

interface CommentItemProps {
  comment: PromptCommentResponse;
  promptId: string | number;
  isReply?: boolean;
  isLoggedIn?: boolean;
  currentUserIcon?: string | null;
  currentUserName?: string | null;
}

export function CommentItem({
  comment,
  promptId,
  isReply = false,
  isLoggedIn = false,
  currentUserIcon,
  currentUserName,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [report, setReport] = useState({ open: false, reason: "", detail: "" });
  const { mutate: reportMutate } = useReportMutation();

  const handleToggleReplyForm = () => {
    setShowReplyForm((prev) => !prev);
  };

  const handleReportClick = useCallback(() => {
    if (!isLoggedIn) {
      toasts.error("로그인 후 이용할 수 있습니다.");
      return;
    }
    setReport({ open: true, reason: "", detail: "" });
  }, [isLoggedIn]);

  const closeReportModal = useCallback(() => {
    setReport({ open: false, reason: "", detail: "" });
  }, []);

  const handleReportSubmit = useCallback(() => {
    reportMutate(
      {
        targetType: "COMMENT",
        targetId: String(comment.commentId),
        reason: report.reason,
        reasonDetail: report.reason === "OTHER" ? report.detail : "",
      },
      { onSuccess: closeReportModal }
    );
  }, [reportMutate, comment.commentId, report.reason, report.detail, closeReportModal]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-5 items-start w-full">
        <ProfIcon
          src={null}
          width={60}
          height={60}
          alt={comment.nickName}
          fallback={comment.nickName}
        />

        <div className="flex-1 flex flex-col gap-2 bg-white border border-gray-100 rounded-10 shadow-sm px-5 py-3">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2.5 items-end">
              <span className="body-large font-normal text-gray-900">
                {comment.nickName}
              </span>
              <span className="label-small text-gray-600">
                {formatCommentDate(comment.createdAt)}
              </span>
            </div>
            <p className="body-medium text-gray-900">{comment.comment}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {!isReply && (
                <button
                  type="button"
                  aria-label="답글 달기"
                  onClick={handleToggleReplyForm}
                  className="hover:opacity-70 transition-300"
                >
                  <Reply
                    size={20}
                    className={
                      showReplyForm ? "text-frog-600" : "text-gray-700"
                    }
                  />
                </button>
              )}
            </div>

            <button
              type="button"
              aria-label="신고"
              onClick={handleReportClick}
              className="hover:opacity-70 transition-300"
            >
              <Siren
                size={20}
                fill="currentColor"
                strokeWidth={0}
                className="text-gray-700"
              />
            </button>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="pl-20">
          <CommentForm
            promptId={promptId}
            parentCommentId={comment.commentId}
            userIcon={currentUserIcon}
            userName={currentUserName}
            onSuccess={() => setShowReplyForm(false)}
          />
        </div>
      )}

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
              해당 댓글의 부적절한 내용을 신고하는 창입니다.
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
    </div>
  );
}
