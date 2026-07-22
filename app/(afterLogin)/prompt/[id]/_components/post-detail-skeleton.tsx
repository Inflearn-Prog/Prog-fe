import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 작성자 프로필 카드 스켈레톤 */}
      <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex gap-5 items-end">
        <Skeleton className="w-[88px] h-[88px] rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* 게시글 상세 카드 스켈레톤 */}
      <div className="bg-white border border-gray-100 rounded-10 shadow-sm p-5 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <Skeleton className="h-6 w-16 rounded-5" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <Skeleton className="h-7 w-16 rounded-5" />
            <div className="flex gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-6 h-6 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
