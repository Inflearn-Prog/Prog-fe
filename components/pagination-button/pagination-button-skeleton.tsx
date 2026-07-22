import { Skeleton } from "@/components/ui/skeleton";

export const PAGINATION_LAYOUT = {
  CONTAINER: "flex gap-2 min-w-[400px] justify-between items-center",
  NUMBER_GROUP: "flex flex-row gap-1 items-center justify-center min-w-[232px]",
  ARROW_GROUP: "flex flex-row gap-1",
};

export function PaginationButtonSkeleton() {
  return (
    <div className="flex justify-center w-full">
      <div className={PAGINATION_LAYOUT.CONTAINER}>
        <div className={PAGINATION_LAYOUT.ARROW_GROUP}>
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
        </div>

        <div className={PAGINATION_LAYOUT.NUMBER_GROUP}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-md" />
          ))}
        </div>

        <div className={PAGINATION_LAYOUT.ARROW_GROUP}>
          <Skeleton className="w-10 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
