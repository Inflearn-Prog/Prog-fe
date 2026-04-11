"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
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
  bulkUpdateUserRole,
  bulkUpdateUserStatus,
  getAdminUsers,
} from "@/queries/api/admin";

import { USER_STATUS_LABEL } from "../constant";
import { UserStatus } from "../types";

export function UsersTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { page, keyword }],
    queryFn: () =>
      getAdminUsers({ page, size: 20, keyword: keyword || undefined }),
    select: (res) => res.data,
  });

  const statusMutation = useMutation({
    mutationFn: bulkUpdateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setSelectedIds([]);
    },
  });

  const roleMutation = useMutation({
    mutationFn: bulkUpdateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setSelectedIds([]);
    },
  });

  const users = data?.content ?? [];
  const pageInfo = data?.pageInfo;
  const totalPages = pageInfo?.totalPages ?? 0;

  const handleSearch = () => {
    setKeyword(inputValue);
    setPage(0);
    setSelectedIds([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleStatusChange = (status: UserStatus) => {
    if (selectedIds.length === 0) return;
    statusMutation.mutate({ userIds: selectedIds, status });
  };

  return (
    <div className="space-y-4">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="닉네임을 검색하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-frog-600"
        />
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {selectedIds.length}명 선택됨
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("SUSPENDED")}
            disabled={statusMutation.isPending}
          >
            활동 제한
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={statusMutation.isPending}
          >
            제한 해제
          </Button>
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={
                    users.length > 0 && selectedIds.length === users.length
                  }
                  onChange={() =>
                    selectedIds.length === users.length
                      ? setSelectedIds([])
                      : setSelectedIds(users.map((u) => u.userId))
                  }
                  className="accent-frog-600"
                />
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                유저 이름
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                역할
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                게시글
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                댓글
              </TableHead>
              <TableHead className="font-semibold text-frog-600">
                활동 제한
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-gray-400"
                >
                  유저가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.userId)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(user.userId)
                            ? prev.filter((x) => x !== user.userId)
                            : [...prev, user.userId]
                        )
                      }
                      className="accent-frog-600"
                    />
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {user.nickname}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.role}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.promptCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.commentCount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${
                        user.status === "SUSPENDED"
                          ? "font-medium text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      {USER_STATUS_LABEL[user.status]}
                    </span>
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
