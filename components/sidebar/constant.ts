import { ROUTES } from "@/lib/routes";

export const RANK_CATEGORY_LIST = {
  title: "직군별 랭킹",
  items: [
    { label: "전체", href: ROUTES.rank.ROOT },
    { label: "개발", href: ROUTES.rank.DEVELOPMENT },
    { label: "마케팅/콘텐츠", href: ROUTES.rank.MARKETING_CONTENT },
    { label: "서비스 기획", href: ROUTES.rank.SERVICE_PLANNING },
    { label: "인사/총무", href: ROUTES.rank.HR_GENERAL_AFFAIRS },
    { label: "디자인", href: ROUTES.rank.DESIGN },
  ],
} as const;

export const COMMUNITY_CATEGORY_LIST = {
  title: "커뮤니티",
  items: [
    { label: "전체", href: ROUTES.community.ROOT },
    { label: "개발", href: ROUTES.community.DEVELOPMENT },
    { label: "마케팅/콘텐츠", href: ROUTES.community.MARKETING_CONTENT },
    { label: "서비스 기획", href: ROUTES.community.SERVICE_PLANNING },
    { label: "인사/총무", href: ROUTES.community.HR_GENERAL_AFFAIRS },
    { label: "디자인", href: ROUTES.community.DESIGN },
  ],
} as const;

/**
 * 프론트 슬러그 → 백엔드 카테고리명 후보 매핑.
 * 백엔드 응답에 슬러그 필드가 없어 한글 name 매칭으로 categoryId를 도출하기 위함.
 * 후보 순서대로 먼저 매칭되는 이름을 사용한다 (대소문자/공백 차이 흡수용 폴백).
 * 백엔드 카테고리명이 정확히 어떤 표기인지 확인되면 후보 정리 가능.
 */
export const CATEGORY_SLUG_TO_NAME_CANDIDATES: Record<string, string[]> = {
  development: ["개발"],
  marketing_content: ["마케팅/콘텐츠", "마케팅"],
  service_planning: ["서비스 기획", "서비스기획", "기획"],
  hr_general_affairs: ["인사/총무", "인사", "총무"],
  design: ["디자인"],
};
