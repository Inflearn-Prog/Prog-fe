import UserProfileSkeleton from "@/components/mypage/user-profile-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function MypageLeftSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <UserProfileSkeleton />
      <Skeleton />
    </div>
  );
}
