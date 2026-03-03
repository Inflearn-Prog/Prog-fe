"use client";

import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import useQueryParams from "@/app/hooks/use-query-params";
import { BaseButton } from "@/components/shared/button";
import { IconInput } from "@/components/shared/inputs";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [search, setSearch] = useState(q || "");

  const { setParams } = useQueryParams();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }
    setParams({ q: search });
  };

  useEffect(() => {
    setSearch(q || "");
  }, [searchParams]);

  return (
    <form
      onSubmit={handleSearch}
      className="p-5 rounded-10 bg-white border w-full flex items-center gap-x-4"
    >
      <IconInput
        name="all4"
        inputSize="lg"
        className="w-full flex-1"
        icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
        placeholder="프롬프트를 검색해보세요"
        maxLength={100}
        // viewLength={true}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <BaseButton type="submit" size="lg" className="">
        검색
      </BaseButton>
    </form>
  );
}
