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
  { value: "PRIVATE", label: "게시글/댓글 숨김" },
  { value: "DELETE", label: "게시글/댓글 삭제" },
  { value: "REJECT", label: "신고 반려 (관련 없음)" },
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
  const [selectedAction, setSelectedAction] =
    useState<ProcessAction>("PRIVATE");

  const handleSubmit = () => {
    if (selectedAction === "REJECT") {
      onReject();
    } else {
      onProcess(selectedAction);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>신고 처리</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">신고 내용</p>
            <p className="text-sm text-gray-600">
              [{REPORT_REASON_LABEL[report.reason]}] {report.reasonContent}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              신고자: {report.reporterNickname}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              처리 방식 선택
            </p>
            <div className="space-y-2">
              {ACTION_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="action"
                    value={value}
                    checked={selectedAction === value}
                    onChange={() => setSelectedAction(value)}
                    className="accent-frog-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="bg-frog-600 hover:bg-frog-700"
          >
            {isProcessing ? "처리 중..." : "처리 완료"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
