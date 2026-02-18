"use client";

import { Siren, ThumbsUpIcon } from "lucide-react";

import { PromptCardProps } from "@/app/types/type";

import { ProfIcon } from "../profile-icon/profile-icon";
import { BaseButton } from "../shared/button";
import { CATEGORY_MAP } from "./constants";

const STYLES = {
  CARD_CONTAINER:
    "w-full mx-auto p-6 bg-gray-0 border border-gray-100 rounded-10 shadow-sm",
  TAG: "px-2 py-1 label-small font-medium text-frog-600 bg-frog-100 rounded-5 inline-block mb-4",
  TITLE: "heading-medium font-bold text-gray-1000 mb-2",
  DESCRIPTION: "text-gray-1000 mb-6",
  USER_SECTION: "flex items-center gap-3",
  NICKNAME: "text-gray-1000 label-small !font-bold",
  USER_DESC: "label-small text-gray-700 !font-bold",
  BUTTON: "px-2 py-4",
  ACTION_BAR: "mt-6 flex items-center justify-between",
  ICON_GROUP: "flex items-center gap-4 text-gray-800",
  ICON_BUTTON: "hover:opacity-70 transition-opacity",
};

export default function PromptCard({
  id,
  category,
  title,
  content,
  userIcon,
  userName,
  userDesc,
  isLiked,
  onCopy,
  onLike,
  onReport,
  onPreview,
}: PromptCardProps) {
  const categoryLabel = CATEGORY_MAP.get(category) || category;

  return (
    <article className={STYLES.CARD_CONTAINER}>
      {/* 카테고리 태그 */}
      <div className={STYLES.TAG}>{categoryLabel}</div>

      {/* 텍스트 콘텐츠 */}
      <h2 className={STYLES.TITLE}>{title}</h2>
      <p className={STYLES.DESCRIPTION}>{content}</p>

      {/* 유저 정보 */}
      <div className={STYLES.USER_SECTION}>
        <ProfIcon
          src={userIcon}
          width={50}
          height={50}
          alt={userName}
          fallback={userName}
        />
        <div>
          <p className={STYLES.NICKNAME}>{userName}</p>
          <p className={STYLES.USER_DESC}>{userDesc}</p>
        </div>
      </div>

      {/* 하단 버튼 및 아이콘 */}
      <div className={STYLES.ACTION_BAR}>
        <div className="flex gap-2">
          <BaseButton
            size={"sm"}
            shape={"round"}
            className={STYLES.BUTTON}
            onClick={onCopy}
          >
            복사
          </BaseButton>
          {/* TODO: 미리보기 기능 구현 후 활성 */}
          {/*<BaseButton
            size={"sm"}
            shape={"round"}
            className={STYLES.BUTTON}
            onClick={onPreview}
          >
            미리보기
          </BaseButton>*/}
        </div>
        <div className={STYLES.ICON_GROUP}>
          <button
            type="button"
            className={`${STYLES.ICON_BUTTON} ${isLiked ? "text-frog-600" : "text-gray-800"}`}
            aria-label="좋아요"
            onClick={() => onLike?.(id, !!isLiked)}
          >
            <ThumbsUpIcon size={20} fill={"currentColor"} strokeWidth={0} />
          </button>
          <button
            type="button"
            className={STYLES.ICON_BUTTON}
            aria-label="신고"
            onClick={onReport}
          >
            <Siren size={20} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </div>
    </article>
  );
}
