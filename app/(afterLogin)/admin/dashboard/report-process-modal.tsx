"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { REPORT_REASON_LABEL } from "../constant";
import { PendingReport, ReportAction } from "../types";

type ProcessAction = ReportAction | "REJECT";

const ACTION_OPTIONS: { value: ProcessAction; label: string }[] = [
  { value: "DELETE", label: "게시글/댓글 삭제" },
  { value: "PRIVATE", label: "게시글/댓글 숨김 + 작성자 제한" },
  { value: "REJECT", label: "신고 반려 (문제 없음)" },
];

interface ReportProcessModalProps {
  report: PendingReport;
  isProcessing: boolean;
  onProcess: (action: ReportAction, adminRemark?: string) => void;
  onReject: (adminRemark?: string) => void;
  onClose: () => void;
}

export function ReportProcessModal({
  report,
  isProcessing,
  onProcess,
  onReject,
  onClose,
}: ReportProcessModalProps) {
  const [selectedAction, setSelectedAction] = useState<ProcessAction>("DELETE");
  const [adminRemark, setAdminRemark] = useState("");

  const handleSubmit = () => {
    const remark = adminRemark.trim() || undefined;
    if (selectedAction === "REJECT") {
      onReject(remark);
    } else {
      onProcess(selectedAction, remark);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>신고 처리</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-bold text-gray-900">신고 내용</p>
            <div className="space-y-1">
              <p className="text-sm text-gray-800">{report.targetTitle}</p>
              <p className="text-sm text-gray-500">
                {REPORT_REASON_LABEL[report.reason]}
                {report.reasonContent ? ` · ${report.reasonContent}` : ""}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-gray-900">
              처리 방식 선택
            </p>
            <div className="space-y-3">
              {ACTION_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2.5 text-sm"
                >
                  <input
                    type="radio"
                    name="action"
                    value={value}
                    checked={selectedAction === value}
                    onChange={() => setSelectedAction(value)}
                    className="h-4 w-4 accent-frog-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-gray-900">관리자 메모</p>
            <textarea
              value={adminRemark}
              onChange={(e) => setAdminRemark(e.target.value)}
              placeholder="처리 사유를 입력해 주세요. (선택)"
              maxLength={500}
              rows={3}
              className="w-full resize-none rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:text-gray-400 focus:border-frog-600"
            />
          </div>
        </div>

        <DialogFooter className="mt-2 flex w-full gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="flex-[4] bg-frog-600 hover:bg-frog-700"
          >
            {isProcessing ? "처리 중..." : "처리 완료"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
