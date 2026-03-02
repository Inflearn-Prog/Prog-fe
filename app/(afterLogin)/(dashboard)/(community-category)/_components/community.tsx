// 2026-03-02
// community.tsx
"use client";

// 아이콘 라이브러리: https://lucide.dev/
import { ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

import { formatRelativeDate } from "@/lib/format-date";
import { ROUTES } from "@/lib/routes";

import { CommunityPromptItem } from "../../_types/community-type";

export function CommunitySection() {
  return (
    <div className="border p-5 rounded-10 bg-white">
      <CommunityList />
    </div>
  );
}

const dummyData: CommunityPromptItem[] = [
  {
    id: 1,
    title: "백엔드 개발자 면접 질문 모음",
    preview: "최근 백엔드 개발자 면접에서 자주 나오는 질문들을 모아봤어요...",
    jobCategory: "BACKEND",
    likeCount: 120,
    copyCount: 30,
    authorNickname: "dev_guru",
    createdAt: "2026-03-02T10:00:00Z",
  },
  {
    id: 2,
    title: "프론트엔드 개발자 면접 질문 모음",
    preview: "프론트엔드 개발자 면접에서 자주 나오는 질문들을 정리했어요...",
    jobCategory: "FRONTEND",
    likeCount: 95,
    copyCount: 20,
    authorNickname: "frontend_master",
    createdAt: "2026-02-27T15:30:00Z",
  },
];

export function CommunityList() {
  return (
    <ul>
      {dummyData.map((item) => (
        <li key={item.id}>
          <CommunityItem {...item} />
        </li>
      ))}
    </ul>
  );
}

// CommunityPromptItem 단일 타입을 확장한 CommunityItem Props 타입
export type CommunityItemProps = CommunityPromptItem;

// 커뮤니티 개별 아이템 컴포넌트
export function CommunityItem(props: CommunityItemProps) {
  return (
    <Link
      href={ROUTES.prompt.DETAIL(props.id.toString())}
      className="py-4 px-3 flex items-center justify-between text-black border-b gap-x-5"
    >
      <h3 className="label-large font-bold">
        {props.title} [{props.likeCount}]
      </h3>
      <div className="flex items-center label-small gap-x-4">
        <p className="label-small p-0">{props.authorNickname}</p>
        <p className="label-small p-0">{formatRelativeDate(props.createdAt)}</p>

        {/* //LATER 추천하기 기능 추가 */}
        <button
          className="label-small p-0 flex flex-center gap-x-1.5"
          type="button"
          aria-label="좋아요"
        >
          <ThumbsUpIcon
            className="p-0"
            size={20}
            fill={"currentColor"}
            strokeWidth={0}
          />
          {props.likeCount}
        </button>
      </div>
    </Link>
  );
}
