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
    <Skeleton
      className="h-[638px] p-4 bg-gray-100/60"
      data-slot="board-skeleton"
      aria-hidden
    />
  );
}

export { BoardSkeleton, Skeleton };
