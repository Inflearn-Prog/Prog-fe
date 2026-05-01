"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import useQueryParams from "@/app/hooks/use-query-params";

import { IconInput } from "../shared/inputs";

function trimAndSanitizedValue(value: string) {
  // eslint-disable-next-line no-useless-escape
  return value.trim().replace(/[<>\"\'&]/g, "");
}

export function HeaderSearch({ onClose }: { onClose?: () => void }) {
  const inputId = useId();

  const { getParam, setParam, deleteParam } = useQueryParams();

  const q = getParam("q") || ""; // 검색어 파라미터에서 초기값 가져오기
  const [searchValue, setSearchValue] = useState(q);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = searchValue.trim();
    if (!normalized) {
      deleteParam("q");
      if (onClose) onClose();
      return;
    }
    setParam("q", normalized);
    if (onClose) onClose();
  };

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  return (
    <form onSubmit={onSubmit} className="relative flex items-center gap-2">
      <div className="flex-1">
        <IconInput
          icon={<SearchIcon width={20} height={20} />}
          name="header-search"
          rounded
          placeholder="검색어를 입력하세요"
          id={`${inputId}-header-search`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoComplete="off"
          aria-label="검색어 입력"
        />
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="p-2 lg:hidden">
          <XIcon className="size-5 text-gray-400" />
        </button>
      )}
    </form>
  );
}
