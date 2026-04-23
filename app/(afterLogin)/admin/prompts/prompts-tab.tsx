"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { toasts } from "@/components/shared/toast";
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

import { PromptStatus } from "../types";
import { formatDate } from "../utils";
import { PromptFilters } from "./prompt-filters";

const CATEGORY_OPTIONS = [
  { value: "", label: "카테고리 변경" },
  { value: "1", label: "개발" },
  { value: "2", label: "마케팅/콘텐츠" },
  { value: "3", label: "서비스기획" },
  { value: "4", label: "인사/총무" },
  { value: "5", label: "디자인" },
] as const;

const CATEGORY_NAME_TO_ID: Record<string, string> = {
  개발: "1",
  "마케팅/콘텐츠": "2",
  서비스기획: "3",
  "인사/총무": "4",
  디자인: "5",
};

const STATUS_OPTIONS = [
  { value: "", label: "상태 변경" },
  { value: "PUBLIC", label: "공개" },
  { value: "PRIVATE", label: "비공개" },
] as const;

export function PromptsTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<PromptStatus | "">("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin",
      "prompts",
      { page, keyword, category: categoryFilter, status: statusFilter },
    ],
    queryFn: () =>
      getAdminPrompts({
        page,
        size: 10,
        keyword: keyword || undefined,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
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
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      toasts.error("게시글 삭제에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: bulkUpdatePrompts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      setSelectedIds([]);
      setBulkCategory("");
      setBulkStatus("");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prompts"] });
      toasts.error("게시글 수정에 실패했습니다.");
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

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
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

  const handleBulkCategoryChange = (value: string) => {
    setBulkCategory(value);
    if (!value || selectedIds.length === 0) return;
    updateMutation.mutate({
      promptIds: selectedIds,
      updateFields: { categoryId: Number(value) },
    });
  };

  const handleBulkStatusChange = (value: string) => {
    setBulkStatus(value);
    if (!value || selectedIds.length === 0) return;
    updateMutation.mutate({
      promptIds: selectedIds,
      updateFields: { status: value as PromptStatus },
    });
  };

  const handleInlineCategory = (promptId: number, value: string) => {
    if (!value) return;
    updateMutation.mutate({
      promptIds: [promptId],
      updateFields: { categoryId: Number(value) },
    });
  };

  const handleInlineStatus = (promptId: number, value: string) => {
    if (!value) return;
    updateMutation.mutate({
      promptIds: [promptId],
      updateFields: { status: value as PromptStatus },
    });
  };

  const isPending = updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PromptFilters
          keyword={keyword}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onStatusFilter={handleStatusFilter}
        />

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {selectedIds.length}개 수정
            </span>
            <select
              value={bulkCategory}
              onChange={(e) => handleBulkCategoryChange(e.target.value)}
              disabled={isPending}
              className="h-10 w-[160px] rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-frog-600"
            >
              {CATEGORY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={bulkStatus}
              onChange={(e) => handleBulkStatusChange(e.target.value)}
              disabled={isPending}
              className="h-10 w-[160px] rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-frog-600"
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isPending}
              className="h-10"
            >
              삭제
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-frog-100">
              <TableHead className="w-14 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-frog-600"
                />
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                게시글 제목
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                작성자명
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                카테고리·수정
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
                게시글 상태
              </TableHead>
              <TableHead className="text-center font-semibold text-frog-600">
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
                  <TableCell className="w-14 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prompt.promptId)}
                      onChange={() => toggleOne(prompt.promptId)}
                      className="accent-frog-600"
                    />
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-left text-sm">
                    {prompt.title}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {prompt.authorNickname}
                  </TableCell>
                  <TableCell className="text-center">
                    <select
                      value={CATEGORY_NAME_TO_ID[prompt.categoryName] ?? ""}
                      onChange={(e) =>
                        handleInlineCategory(prompt.promptId, e.target.value)
                      }
                      className="rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-frog-600"
                    >
                      {CATEGORY_OPTIONS.filter((o) => o.value !== "").map(
                        ({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </TableCell>
                  <TableCell className="text-center">
                    <select
                      value={prompt.status}
                      onChange={(e) =>
                        handleInlineStatus(prompt.promptId, e.target.value)
                      }
                      className="rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:border-frog-600"
                    >
                      <option value="PUBLIC">공개</option>
                      <option value="PRIVATE">비공개</option>
                      <option value="DELETED">삭제</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-500">
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
