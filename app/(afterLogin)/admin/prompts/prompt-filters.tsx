"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

import { promptQueries } from "@/queries/options/prompt-query";

import { PromptStatus } from "../types";

interface PromptFiltersProps {
  keyword: string;
  categoryFilter: string;
  statusFilter: PromptStatus | "";
  onSearch: (value: string) => void;
  onCategoryFilter: (value: string) => void;
  onStatusFilter: (value: PromptStatus | "") => void;
}

export function PromptFilters({
  keyword,
  categoryFilter,
  statusFilter,
  onSearch,
  onCategoryFilter,
  onStatusFilter,
}: PromptFiltersProps) {
  const [inputValue, setInputValue] = useState(keyword);
  const { data: categories = [] } = useQuery(promptQueries.categories());

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="게시글 제목 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-frog-600"
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryFilter(e.target.value)}
        className="h-10 w-[160px] rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-frog-600"
      >
        <option value="">카테고리</option>
        {categories.map((c) => (
          <option key={c.categoryId} value={String(c.categoryId)}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value as PromptStatus | "")}
        className="h-10 w-[160px] rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-frog-600"
      >
        <option value="">전체</option>
        <option value="PUBLIC">공개</option>
        <option value="PRIVATE">비공개</option>
        <option value="DELETED">삭제</option>
      </select>
    </div>
  );
}
