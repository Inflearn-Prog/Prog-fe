"use client";

import useQueryParams from "@/app/hooks/use-query-parmas";
import { cn } from "@/lib/utils";

const SORT_TYPES = ["latest", "popular"] as const;
export type SortType = (typeof SORT_TYPES)[number];

export function SortGroup() {
  const { getParam, setParams } = useQueryParams();

  const currentSort = getParam("sort") as SortType | null;
  const handleSortChange = (sort: SortType) => {
    setParams({ sort });
  };

  const spanStyle = (sort: SortType) =>
    cn(
      "whitespace-nowrap text-15",
      currentSort === sort ? "text-prog-600 font-bold" : "text-gray-500"
    );

  return (
    <div className="flex items-start gap-x-1">
      <button onClick={() => handleSortChange("latest")}>
        <span className={spanStyle("latest")}>시간순</span>
      </button>
      |
      <button onClick={() => handleSortChange("popular")}>
        <span className={spanStyle("popular")}>인기순</span>
      </button>
    </div>
  );
}
