import { BoardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PromptFormSkeleton() {
  const layout = cn("mx-auto max-w-7xl lg:px-0 px-5 min-w-90 mx-auto");

  return (
    <div className="w-full">
      <div className={layout}>
        {/* Title Skeleton */}
        <div className="relative pb-7.5">
          <Skeleton className="h-15 w-full border-none bg-gray-100/60" />
        </div>

        {/* Category Skeleton */}
        <div className="relative pb-7.5">
          <div className="w-full md:max-w-76.25">
            <Skeleton className="h-12 w-full bg-gray-100/60" />
          </div>
        </div>

        {/* Board Skeleton */}
        <div className="relative pb-7.5">
          <BoardSkeleton />
        </div>
      </div>

      {/* Footer Buttons Skeleton */}
      <div className="py-5 bg-white flex items-center">
        <div
          className={cn(
            layout,
            "flex justify-end gap-x-2 flex-1 flex-wrap gap-y-5"
          )}
        >
          <Skeleton className="w-full md:w-49.25 h-10" />
          <Skeleton className="w-full md:w-49.25 h-10" />
        </div>
      </div>
    </div>
  );
}
