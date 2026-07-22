import { ROUTES } from "@/lib/routes";

export type CategoryItemType = {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
};

export const RANK_CATEGORY_LIST = {
  title: "직군별 랭킹",
  items: [
    { label: "전체", href: ROUTES.rank.ROOT },
    {
      label: "개발",
      href: ROUTES.rank.DEVELOPMENT,
      subItems: [
        { label: "프론트엔드", href: ROUTES.rank.FRONTEND },
        { label: "백엔드", href: ROUTES.rank.BACKEND },
        { label: "서버", href: ROUTES.rank.SERVER },
      ],
    },
    { label: "디자인", href: ROUTES.rank.DESIGN },
    { label: "서비스 기획", href: ROUTES.rank.SERVICE_PLANNING },
    { label: "인사/총무", href: ROUTES.rank.HR },
    {
      label: "마케팅/콘텐츠",
      href: ROUTES.rank.MARKETING_CONTENT,
      subItems: [{ label: "SNS 마케팅", href: ROUTES.rank.SNS_MARKETING }],
    },
    { label: "기타", href: ROUTES.rank.ETC },
  ] as CategoryItemType[],
} as const;

export const COMMUNITY_CATEGORY_LIST = {
  title: "커뮤니티",
  items: [
    { label: "전체", href: ROUTES.community.ROOT },
    {
      label: "개발",
      href: ROUTES.community.DEVELOPMENT,
      subItems: [
        { label: "프론트엔드", href: ROUTES.community.FRONTEND },
        { label: "백엔드", href: ROUTES.community.BACKEND },
        { label: "서버", href: ROUTES.community.SERVER },
      ],
    },
    { label: "디자인", href: ROUTES.community.DESIGN },
    { label: "서비스 기획", href: ROUTES.community.SERVICE_PLANNING },
    { label: "인사/총무", href: ROUTES.community.HR },
    {
      label: "마케팅/콘텐츠",
      href: ROUTES.community.MARKETING_CONTENT,
      subItems: [{ label: "SNS 마케팅", href: ROUTES.community.SNS_MARKETING }],
    },
    { label: "기타", href: ROUTES.community.ETC },
  ] as CategoryItemType[],
} as const;

export const CATEGORY_SLUG_TO_NAME_CANDIDATES: Record<string, string[]> = {
  development: ["개발"],
  marketing_content: ["마케팅/콘텐츠", "마케팅"],
  design: ["디자인"],
  service_planning: ["서비스 기획", "서비스기획", "기획"],
  hr: ["인사/총무", "인사", "총무"],
  etc: ["기타", "분류되지 않은 프롬프트"],
  backend: ["백엔드", "API"],
  frontend: ["프론트엔드", "UI/UX 개발"],
  server: ["서버"],
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
  hr: 9,
  server: 10,
};
