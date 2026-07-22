"use client";

import { useSearchParams } from "next/navigation";

import { PageTitleGroup } from "@/components/shared/page-title-group";
import { COMMUNITY_CATEGORY_LIST } from "@/components/sidebar/constant";

// 카테고리별 서브타이틀 매핑
const CATEGORY_SUBTITLE_MAP: Record<string, string> = {
  "": "커뮤니티의 다양한 글을 확인해보세요.",
  development: "개발 관련 글을 확인해보세요.",
  marketing_content: "마케팅/콘텐츠 관련 글을 확인해보세요.",
  service_planning: "서비스 기획 관련 글을 확인해보세요.",
  hr_general_affairs: "인사/총무 관련 글을 확인해보세요.",
  design: "디자인 관련 글을 확인해보세요.",
  frontend: "프론트엔드 관련 글을 확인해보세요.",
  backend: "백엔드 관련 글을 확인해보세요.",
  server: "서버 관련 글을 확인해보세요.",
  sns_marketing: "SNS 마케팅 관련 글을 확인해보세요.",
};

/**
 * searchParams의 category 값에 따라 타이틀을 동적으로 표시하는 컴포넌트
 * layout에서는 searchParams 접근이 불가하므로 Client Component로 분리
 */
export function CommunityPageTitle() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";

  const allItems = COMMUNITY_CATEGORY_LIST.items.flatMap((item) => [
    item,
    ...(item.subItems ?? []),
  ]);

  // COMMUNITY_CATEGORY_LIST에서 현재 카테고리에 해당하는 label을 조회
  const matchedItem = allItems.find((item) => item.href.includes(category));

  // 카테고리가 없으면 전체(기본값) 타이틀 사용
  const title = matchedItem?.label ?? "전체";
  // eslint-disable-next-line security/detect-object-injection
  const subtitle = CATEGORY_SUBTITLE_MAP[category] ?? "";

  return <PageTitleGroup title={title} subtitle={subtitle} />;
}
