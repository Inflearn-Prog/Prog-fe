import React from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

function BoardSkeleton() {
  return (
    <Skeleton className="h-159.5 p-4" data-slot="board-skeleton" aria-hidden>
      {/* 툴바 플레이스홀더 */}
      <div className="flex gap-2 items-center mb-4">
        <div className="w-24 h-6 rounded-md bg-gray-100" />
        <div className="w-12 h-6 rounded-md bg-gray-100/90" />
        <div className="w-8 h-6 rounded-md bg-gray-100/80" />
      </div>

      {/* 제목 플레이스홀더 */}
      <div className="w-4/4 h-6 rounded-md bg-gray-100 mb-3" />

      {/* 본문 라인 플레이스홀더들 */}
      <div className="space-y-3">
        <div className="w-full h-3 rounded-md bg-gray-100" />
        <div className="w-full h-3 rounded-md bg-gray-100" />
        <div className="w-full h-32 rounded-md bg-gray-100/80 mt-2" />
      </div>
    </Skeleton>
  );
}

export { BoardSkeleton, Skeleton };
