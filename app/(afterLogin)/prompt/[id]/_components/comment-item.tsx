"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Reply, Siren } from "lucide-react";
import { useCallback, useState } from "react";

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
import { formatAbsolute } from "@/lib/datetime";
import { PromptCommentResponse } from "@/queries/api/prompts";
import { promptQueries } from "@/queries/options/prompt-query";

import { MAX_COMMENT_LENGTH } from "../../constant";
import { CommentForm } from "./comment-form";

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
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [report, setReport] = useState({ open: false, reason: "", detail: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { mutate: reportMutate } = useReportMutation();

  // 백엔드 댓글 응답에 userId가 없어 닉네임으로 소유자를 판별한다.
  const isOwner =
    isLoggedIn && !!currentUserName && comment.nickName === currentUserName;

  const invalidateComments = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: promptQueries.comments(promptId).queryKey,
    });
  }, [queryClient, promptId]);

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      promptQueries.updateComment(comment.commentId, { comment: editValue }),
    onSuccess: () => {
      setIsEditing(false);
      invalidateComments();
      toasts.success("댓글이 수정되었습니다.");
    },
    onError: () => {
      toasts.error("댓글 수정에 실패했습니다.");
    },
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: () => promptQueries.deleteComment(comment.commentId),
    onSuccess: () => {
      setDeleteConfirm(false);
      invalidateComments();
      toasts.success("댓글이 삭제되었습니다.");
    },
    onError: () => {
      toasts.error("댓글 삭제에 실패했습니다.");
    },
  });

  const handleToggleReplyForm = () => {
    setShowReplyForm((prev) => !prev);
  };

  const handleEditClick = () => {
    setEditValue(comment.comment);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(comment.comment);
  };

  const handleEditSave = () => {
    if (!editValue.trim()) return;
    updateComment();
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
  }, [
    reportMutate,
    comment.commentId,
    report.reason,
    report.detail,
    closeReportModal,
  ]);

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
                {formatAbsolute(comment.createdAt)}
              </span>
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-2 mt-1">
                <div className="relative bg-white border border-gray-200 rounded-5 h-24 px-3 py-2 overflow-hidden">
                  <textarea
                    value={editValue}
                    onChange={(e) =>
                      setEditValue(e.target.value.slice(0, MAX_COMMENT_LENGTH))
                    }
                    aria-label="댓글 수정"
                    className="w-full h-full body-medium text-gray-900 resize-none focus:outline-none bg-transparent"
                  />
                  <span className="absolute bottom-1 right-2 caption-small text-gray-500">
                    {editValue.length}/{MAX_COMMENT_LENGTH}
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={handleEditCancel}
                    className="px-3 py-1 h-7"
                  >
                    취소
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    onClick={handleEditSave}
                    disabled={!editValue.trim() || isUpdating}
                    className="px-3 py-1 h-7"
                  >
                    저장
                  </BaseButton>
                </div>
              </div>
            ) : (
              <p className="body-medium text-gray-900">{comment.comment}</p>
            )}
          </div>

          {!isEditing && (
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

              {isOwner ? (
                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="label-small text-gray-700 hover:text-gray-900 transition-300"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="label-small text-red-600 hover:text-red-700 transition-300"
                  >
                    삭제
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          )}
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
            <DialogTitle>댓글 삭제</DialogTitle>
            <DialogDescription>
              삭제된 댓글은 복구할 수 없습니다. 정말 삭제하시겠습니까?
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
              onClick={() => deleteComment()}
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
