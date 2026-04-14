"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import useQueryParams from "@/app/hooks/use-query-params";

import { IconInput } from "../shared/inputs";

function trimAndSanitizedValue(value: string) {
  // eslint-disable-next-line no-useless-escape
  return value.trim().replace(/[<>\"\'&]/g, "");
}

export function HeaderSearch() {
  const inputId = useId();

  const { getParam, setParam, deleteParam } = useQueryParams();

  const q = getParam("q") || ""; // 검색어 파라미터에서 초기값 가져오기
  const [searchValue, setSearchValue] = useState(q);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = searchValue.trim();
    if (!normalized) {
      deleteParam("q");
      return;
    }
    setParam("q", normalized);
  };

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  return (
    <form onSubmit={onSubmit}>
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
    </form>
  );
}
