import { ROUTES } from "@/lib/routes";

export const RANK_CATEGORY_LIST = {
  title: "직군별 랭킹",
  items: [
    { label: "전체", href: ROUTES.rank.ROOT },
    { label: "개발", href: ROUTES.rank.DEVELOPMENT },
    { label: "마케팅/콘텐츠", href: ROUTES.rank.MARKETING_CONTENT },
    { label: "디자인", href: ROUTES.rank.DESIGN },
    { label: "서비스 기획", href: ROUTES.rank.SERVICE_PLANNING },
    { label: "기타", href: ROUTES.rank.ETC },
    { label: "백엔드", href: ROUTES.rank.BACKEND },
    { label: "프론트엔드", href: ROUTES.rank.FRONTEND },
    { label: "SNS 마케팅", href: ROUTES.rank.SNS_MARKETING },
  ],
} as const;

export const COMMUNITY_CATEGORY_LIST = {
  title: "커뮤니티",
  items: [
    { label: "전체", href: ROUTES.community.ROOT },
    { label: "개발", href: ROUTES.community.DEVELOPMENT },
    { label: "마케팅/콘텐츠", href: ROUTES.community.MARKETING_CONTENT },
    { label: "디자인", href: ROUTES.community.DESIGN },
    { label: "서비스 기획", href: ROUTES.community.SERVICE_PLANNING },
    { label: "기타", href: ROUTES.community.ETC },
    { label: "백엔드", href: ROUTES.community.BACKEND },
    { label: "프론트엔드", href: ROUTES.community.FRONTEND },
    { label: "SNS 마케팅", href: ROUTES.community.SNS_MARKETING },
  ],
} as const;

export const CATEGORY_SLUG_TO_NAME_CANDIDATES: Record<string, string[]> = {
  development: ["개발"],
  marketing_content: ["마케팅/콘텐츠", "마케팅"],
  design: ["디자인"],
  service_planning: ["서비스 기획", "서비스기획", "기획"],
  etc: ["기타", "분류되지 않은 프롬프트"],
  backend: ["백엔드", "서버", "API"],
  frontend: ["프론트엔드", "UI/UX 개발"],
  sns_marketing: ["SNS 마케팅", "소셜 미디어 마케팅"],
};

/**
 * 슬러그 → 백엔드 categoryId 정적 매핑.
 * /categories API 호출 없이 바로 숫자 ID로 변환.
 * 백엔드 categoryId가 변경되면 여기만 수정.
 */

export const CATEGORY_SLUG_TO_ID: Record<string, number> = {
  development: 1,
  marketing_content: 2,
  design: 3,
  service_planning: 4,
  etc: 5,
  backend: 6,
  frontend: 7,
  sns_marketing: 8,
};
