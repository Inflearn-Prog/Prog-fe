"use client";

import { formatRelative } from "@/lib/datetime";
import { cn, stripHtml } from "@/lib/utils";

import { BaseButton } from "../shared/button";

const STYLES = {
  CARD_CONTAINER:
    "w-full mx-auto p-6 bg-gray-0 border border-gray-100 rounded-10 shadow-sm",
  TITLE: "heading-medium font-bold text-gray-1000 mb-2",
  DESCRIPTION: "text-gray-1000 mb-6",
  BUTTON: "px-4 py-2",
  ACTION_BAR: "mt-6 flex items-center justify-between",
};

interface LikedArticleCardProps {
  title: string;
  contentSummary: string;
  onClick?: () => void;
  onCopy: (e: React.MouseEvent) => void;
}
interface MyArticleCardProps {
  title: string;
  contentSummary: string;
  createdAt: string;
  onClick?: () => void;
}

export function LikedArticleCard({
  title,
  contentSummary,
  onCopy,
  onClick,
}: LikedArticleCardProps) {
  return (
    <article
      className={cn(STYLES.CARD_CONTAINER, onClick && "cursor-pointer")}
      {...(onClick && {
        role: "button",
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        },
      })}
    >
      {/* 텍스트 콘텐츠 */}
      <h2 className={STYLES.TITLE}>{title}</h2>
      <div className={STYLES.DESCRIPTION}>{stripHtml(contentSummary)}</div>

      {/* 하단 버튼 및 아이콘 */}
      <div className={STYLES.ACTION_BAR}>
        <div className="flex gap-2">
          <BaseButton
            size={"sm"}
            shape={"round"}
            className={STYLES.BUTTON}
            onClick={(e) => {
              e.stopPropagation();
              onCopy(e);
            }}
          >
            복사
          </BaseButton>
        </div>
      </div>
    </article>
  );
}

export function MyArticleCard({
  title,
  contentSummary,
  createdAt,
  onClick,
}: MyArticleCardProps) {
  return (
    <article className={STYLES.CARD_CONTAINER} onClick={onClick}>
      {/* 텍스트 콘텐츠 */}
      <h2 className={STYLES.TITLE}>{title}</h2>
      <div className={STYLES.DESCRIPTION}>{stripHtml(contentSummary)}</div>

      {/* 하단 버튼 및 아이콘 */}
      <div className={STYLES.ACTION_BAR}>
        <div className="flex gap-2">
          <p>{formatRelative(createdAt)}</p>
        </div>
      </div>
    </article>
  );
}
