"use client";

import { SearchTitle } from "@/components/search/search-title";

import SearchForm from "./search-form";

export function SearchSection({ q }: { q?: string }) {
  return (
    <div className="">
      <SearchForm />

      <div className="flex items-center justify-between">
        <SearchTitle search={q} searchLength={q?.length} />
      </div>
    </div>
  );
}
