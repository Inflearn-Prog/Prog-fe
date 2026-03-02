"use client";

import { SearchTitle } from "@/components/search/search-title";

import { SortGroup } from "../../_components/sort-group";
import SearchForm from "./search-form";

export function SearchSection({ q }: { q?: string }) {
  return (
    <div className="">
      <SearchForm />

      <div className="flex items-start justify-between mt-15.5 gap-x-10">
        <SearchTitle search={q} searchLength={q?.length} />
        <SortGroup />
      </div>

      <div />
    </div>
  );
}
