import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CLASSES = {
  CONTAINER:
    "flex flex-col gap-5 p-6 border border-gray-100 bg-gray-0 rounded-[10px] shadow-md",
  AVATAR_WRAPPER: "flex items-center justify-center",
  INFO_LIST: "flex flex-col gap-3",
  INFO_ITEM: "flex gap-2 py-2 px-4 border border-gray-50 rounded-[5px]",
  PROVIDER_BADGE:
    "flex h-[44px] w-full gap-2 items-center justify-center rounded-[6px] bg-gray-100",
} as const;

export default function UserProfileSkeleton() {
  return (
    <div className={cn(CLASSES.CONTAINER, "animate-pulse")}>
      {/* 프로필 이미지 스켈레톤 */}
      <div className={CLASSES.AVATAR_WRAPPER}>
        <Skeleton className="h-[120px] w-[120px] rounded-full" />
      </div>

      {/* 정보 리스트 스켈레톤 */}
      <div className={CLASSES.INFO_LIST}>
        {/* 닉네임 바 */}
        <div className={CLASSES.INFO_ITEM}>
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-5 w-24" />
        </div>
        {/* 이메일 바 */}
        <div className={CLASSES.INFO_ITEM}>
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-5 w-40" />
        </div>
        {/* 자기소개 바 */}
        <div className={cn(CLASSES.INFO_ITEM, "min-h-[94px] items-start")}>
          <div className="flex flex-col gap-2 w-full pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* 계정 연결 정보 배지 스켈레톤 */}
      <div className={CLASSES.PROVIDER_BADGE}>
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    </div>
  );
}
