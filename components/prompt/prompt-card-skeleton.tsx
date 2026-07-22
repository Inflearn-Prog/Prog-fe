import { Skeleton } from "../ui/skeleton";

const STYLES = {
  CARD_CONTAINER:
    "w-full mx-auto p-6 bg-gray-0 border border-gray-100 rounded-10 shadow-sm",
  TAG: "w-16 h-6 mb-4 rounded-5",
  TITLE: "w-3/4 h-7 mb-2 rounded-md",
  DESCRIPTION: "w-full h-5 mb-6 rounded-md",
  USER_SECTION: "flex items-center gap-3",
  AVATAR: "w-[50px] h-[50px] rounded-full",
  NICKNAME: "w-20 h-4 mb-1 rounded-md",
  USER_DESC: "w-32 h-3 rounded-md",
  ACTION_BAR: "mt-6 flex items-center justify-between",
  BUTTON: "w-20 h-10 rounded-full",
  ICON_GROUP: "flex items-center gap-4",
  ICON: "w-6 h-6 rounded-full",
};

export default function PromptCardSkeleton() {
  return (
    <article className={STYLES.CARD_CONTAINER}>
      {/* 카테고리 태그 */}
      <Skeleton className={STYLES.TAG} />

      {/* 제목 및 본문 */}
      <Skeleton className={STYLES.TITLE} />
      <Skeleton className={STYLES.DESCRIPTION} />

      {/* 유저 정보 영역 */}
      <div className={STYLES.USER_SECTION}>
        <Skeleton className={STYLES.AVATAR} />
        <div>
          <Skeleton className={STYLES.NICKNAME} />
          <Skeleton className={STYLES.USER_DESC} />
        </div>
      </div>

      {/* 하단 액션 바 */}
      <div className={STYLES.ACTION_BAR}>
        <div className="flex gap-2">
          <Skeleton className={STYLES.BUTTON} />
        </div>
        <div className={STYLES.ICON_GROUP}>
          <Skeleton className={STYLES.ICON} />
          <Skeleton className={STYLES.ICON} />
        </div>
      </div>
    </article>
  );
}
