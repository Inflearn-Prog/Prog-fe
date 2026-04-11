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
import {
  bulkDeletePrompts,
  bulkUpdatePrompts,
  getAdminPrompts,
} from "@/queries/api/admin";

import { PROMPT_STATUS_LABEL } from "../constant";
import { PromptStatus } from "../types";
import { PromptFilters } from "./prompt-filters";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const year = String(d.getFullYear()).slice(2);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export function PromptsTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<PromptStatus | "">("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "prompts", { page, keyword, status: statusFilter }],
    queryFn: () =>
      getAdminPrompts({
        page,
        size: 10,
        keyword: keyword || undefined,
        status: statusFilter || undefined,
      }),
    select: (res) => res.data,
  });

  const deleteMutation = useMutation({
    mutationFn: bulkDeletePrompts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      setSelectedIds([]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: bulkUpdatePrompts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      setSelectedIds([]);
    },
  });

  const prompts = data?.content ?? [];
  const pageInfo = data?.pageInfo;
  const totalPages = pageInfo?.totalPages ?? 0;

  const allSelected =
    prompts.length > 0 && selectedIds.length === prompts.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prompts.map((p) => p.promptId));
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(0);
    setSelectedIds([]);
  };

  const handleStatusFilter = (value: PromptStatus | "") => {
    setStatusFilter(value);
    setPage(0);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    deleteMutation.mutate(selectedIds);
  };

  const handleBulkStatusChange = (status: PromptStatus) => {
    if (selectedIds.length === 0) return;
    updateMutation.mutate({
      promptIds: selectedIds,
      updateFields: { status },
    });
  };

  return (
    <div className="space-y-4">
      <PromptFilters
        keyword={keyword}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {selectedIds.length > 0 && `${selectedIds.length}개 선택됨`}
        </p>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkStatusChange("PRIVATE")}
                disabled={updateMutation.isPending}
              >
                비공개 전환
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteMutation.isPending}
              >
                일괄 삭제
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-frog-600"
                />
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                게시글 제목
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                작성자명
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                카테고리·수정
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                게시글 상태
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                작성일
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : prompts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-400"
                >
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              prompts.map((prompt) => (
                <TableRow key={prompt.promptId}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prompt.promptId)}
                      onChange={() => toggleOne(prompt.promptId)}
                      className="accent-frog-600"
                    />
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-sm">
                    {prompt.title}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {prompt.authorNickname}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {prompt.categoryName}
                  </TableCell>
                  <TableCell className="text-sm">
                    {PROMPT_STATUS_LABEL[prompt.status] ?? prompt.status}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(prompt.createdAt)}
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
