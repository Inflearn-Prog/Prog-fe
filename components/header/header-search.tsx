"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { ROUTES } from "@/lib/routes";

import { IconInput } from "../shared/inputs";

function trimAndSanitizedValue(value: string) {
  // eslint-disable-next-line no-useless-escape
  return value.trim().replace(/[<>\"\'&]/g, "");
}

export function HeaderSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const inputId = useId();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const searchParams = new URLSearchParams();
      searchParams.set("q", trimAndSanitizedValue(searchValue));
      router.push(`${ROUTES.search.ROOT}?${searchParams.toString()}`);
    } catch (error) {
      console.error("검색어 처리 중 오류 발생:", error);
    }
  };

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
