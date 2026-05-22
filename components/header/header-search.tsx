"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import useQueryParams from "@/app/hooks/use-query-params";
import { ROUTES } from "@/lib/routes";

import { IconInput } from "../shared/inputs";

export function HeaderSearch({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const inputId = useId();

  const { getParam, deleteParam } = useQueryParams();

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
    router.push(`${ROUTES.search.ROOT}?q=${encodeURIComponent(normalized)}`);
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
