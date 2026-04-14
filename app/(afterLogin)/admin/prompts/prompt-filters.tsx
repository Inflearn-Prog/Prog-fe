"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { PromptStatus } from "../types";

interface PromptFiltersProps {
  keyword: string;
  categoryFilter: string;
  statusFilter: PromptStatus | "";
  onSearch: (value: string) => void;
  onCategoryFilter: (value: string) => void;
  onStatusFilter: (value: PromptStatus | "") => void;
}

const CATEGORY_OPTIONS = [
  { value: "", label: "카테고리" },
  { value: "development", label: "개발" },
  { value: "marketing_content", label: "마케팅/콘텐츠" },
  { value: "service_planning", label: "서비스기획" },
  { value: "hr_general_affairs", label: "인사/총무" },
  { value: "design", label: "디자인" },
] as const;

export function PromptFilters({
  keyword,
  categoryFilter,
  statusFilter,
  onSearch,
  onCategoryFilter,
  onStatusFilter,
}: PromptFiltersProps) {
  const [inputValue, setInputValue] = useState(keyword);

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
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-frog-600"
      >
        {CATEGORY_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value as PromptStatus | "")}
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-frog-600"
      >
        <option value="">전체</option>
        <option value="PUBLIC">공개</option>
        <option value="PRIVATE">비공개</option>
        <option value="DELETED">삭제</option>
      </select>
    </div>
  );
}
