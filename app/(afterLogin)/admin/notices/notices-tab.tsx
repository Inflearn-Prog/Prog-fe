"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bulkDeleteNotices, getAdminNotices } from "@/queries/api/admin";

import { NoticeDetail } from "./notice-detail";
import { NoticeWriteForm } from "./notice-write-form";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const year = String(d.getFullYear()).slice(2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function NoticesTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [viewNoticeId, setViewNoticeId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "notices", page],
    queryFn: () => getAdminNotices(page, 10),
    select: (res) => res.data,
  });

  const deleteMutation = useMutation({
    mutationFn: bulkDeleteNotices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
      setSelectedIds([]);
    },
  });

  const notices = data?.content ?? [];
  const pageInfo = data?.pageInfo;
  const totalPages = pageInfo?.totalPages ?? 0;
  const allSelected =
    notices.length > 0 && selectedIds.length === notices.length;

  if (viewNoticeId !== null) {
    return (
      <NoticeDetail
        noticeId={viewNoticeId}
        onBack={() => setViewNoticeId(null)}
      />
    );
  }

  if (showWriteForm) {
    return (
      <NoticeWriteForm
        onBack={() => setShowWriteForm(false)}
        onSuccess={() => {
          setShowWriteForm(false);
          queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowWriteForm(true)}
          className="bg-frog-600 hover:bg-frog-700"
        >
          공지사항 추가
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            if (selectedIds.length === 0) return;
            deleteMutation.mutate(selectedIds);
          }}
          disabled={selectedIds.length === 0 || deleteMutation.isPending}
        >
          삭제
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-frog-100">
              <TableHead className="w-14 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    allSelected
                      ? setSelectedIds([])
                      : setSelectedIds(notices.map((n) => n.noticeId))
                  }
                  className="accent-frog-600"
                />
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                공지사항 제목
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                공지사항 내용
              </TableHead>
              <TableHead className="w-[100px] text-center font-semibold text-frog-600">
                공지일
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-gray-400"
                >
                  공지사항이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.noticeId}>
                  <TableCell className="w-14 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notice.noticeId)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(notice.noticeId)
                            ? prev.filter((x) => x !== notice.noticeId)
                            : [...prev, notice.noticeId]
                        )
                      }
                      className="accent-frog-600"
                    />
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-sm">
                    <button
                      onClick={() => setViewNoticeId(notice.noticeId)}
                      className="text-left hover:text-frog-600 hover:underline"
                    >
                      {notice.title}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-gray-500">
                    공지사항 내용...
                  </TableCell>
                  <TableCell className="w-[100px] text-center text-sm text-gray-500">
                    {formatDate(notice.createdAt)}
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
    </div>
  );
}
