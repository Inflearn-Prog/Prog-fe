"use client";

import useQueryParams from "@/app/hooks/use-query-parmas";
import { cn } from "@/lib/utils";

const SORT_TYPES = ["latest", "popular"] as const;
export type SortType = (typeof SORT_TYPES)[number];

// 공통 스타일
const BASE_STYLE = "whitespace-nowrap text-15";
const ACTIVE_STYLE = "text-prog-600 font-bold";
const INACTIVE_STYLE = "text-gray-500";

export function SortGroup() {
  const { getParam, setParams } = useQueryParams();

  const currentSort = getParam("sort") as SortType | null;

  const handleSortChange = (sort: SortType) => {
    setParams({ sort });
  };

  // 활성 정렬 여부 확인 (sort 파라미터 없을 때 기본값은 latest)
  const isActive = (sort: SortType) =>
    sort === "latest"
      ? currentSort === "latest" || currentSort === null
      : currentSort === sort;

  return (
    <div className="flex items-start gap-x-1">
      <button onClick={() => handleSortChange("latest")}>
        <span
          className={cn(
            BASE_STYLE,
            isActive("latest") ? ACTIVE_STYLE : INACTIVE_STYLE
          )}
        >
          시간순
        </span>
      </button>
      |
      <button onClick={() => handleSortChange("popular")}>
        <span
          className={cn(
            BASE_STYLE,
            isActive("popular") ? ACTIVE_STYLE : INACTIVE_STYLE
          )}
        >
          인기순
        </span>
      </button>
    </div>
  );
}
