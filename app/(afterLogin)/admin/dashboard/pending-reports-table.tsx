"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPendingReports,
  processReport,
  rejectReport,
} from "@/queries/api/admin";

import { REPORT_REASON_LABEL } from "../constant";
import { PendingReport } from "../types";
import { ReportProcessModal } from "./report-process-modal";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const year = String(d.getFullYear()).slice(2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hour}:${min}`;
}

export function PendingReportsTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(
    null
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reports", "pending", page],
    queryFn: () => getPendingReports(page, 5),
    select: (res) => res.data,
  });

  const processMutation = useMutation({
    mutationFn: ({
      reportId,
      action,
      adminRemark,
    }: {
      reportId: number;
      action: "PRIVATE" | "DELETE";
      adminRemark?: string;
    }) => processReport(reportId, { action, adminRemark }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      setSelectedReport(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      reportId,
      adminRemark,
    }: {
      reportId: number;
      adminRemark?: string;
    }) => rejectReport(reportId, { adminRemark }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      setSelectedReport(null);
    },
  });

  const reports = data?.content ?? [];
  const pageInfo = data?.pageInfo;
  const totalPages = pageInfo?.totalPages ?? 0;

  return (
    <>
      <div className="rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-frog-600/5">
              <TableHead className="text-center font-semibold text-frog-600">
                신고 일시
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                분류
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                신고 관련글
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                상태
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-gray-400"
                >
                  미처리 신고가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.reportId}>
                  <TableCell className="text-center text-sm text-gray-600">
                    {formatDate(report.reportedAt)}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {REPORT_REASON_LABEL[report.reasonCategory]}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-center text-sm">
                    {report.targetPromptTitle}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="rounded bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      대기
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-sm font-medium text-frog-600 hover:underline"
                    >
                      처리
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t px-4 py-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded px-3 py-1 text-sm ${
                  i === page
                    ? "bg-frog-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {selectedReport && (
        <ReportProcessModal
          report={selectedReport}
          isProcessing={processMutation.isPending || rejectMutation.isPending}
          onProcess={(action, adminRemark) =>
            processMutation.mutate({
              reportId: selectedReport.reportId,
              action,
              adminRemark,
            })
          }
          onReject={(adminRemark) =>
            rejectMutation.mutate({
              reportId: selectedReport.reportId,
              adminRemark,
            })
          }
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
}
