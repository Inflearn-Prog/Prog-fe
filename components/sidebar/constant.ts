import { ROUTES } from "@/lib/routes";

export const RANK_CATEGORY_LIST = {
  title: "직군별 랭킹",
  items: [
    { label: "전체", href: ROUTES.rank.ROOT },
    { label: "개발", href: ROUTES.rank.DEVELOPMENT },
    { label: "마케팅/콘텐츠", href: ROUTES.rank.MARKETING_CONTENT },
    { label: "인사/총무", href: ROUTES.rank.SERVICE_PLANNING },
    { label: "디자인", href: ROUTES.rank.HR_GENERAL_AFFAIRS },
    { label: "디자인", href: ROUTES.rank.DESIGN },
  ],
} as const;

export const COMMUNITY_CATEGORY_LIST = {
  title: "커뮤니티",
  items: [
    { label: "전체", href: ROUTES.community.ROOT },
    { label: "개발", href: ROUTES.community.DEVELOPMENT },
    { label: "마케팅/콘텐츠", href: ROUTES.community.MARKETING_CONTENT },
    { label: "인사/총무", href: ROUTES.community.SERVICE_PLANNING },
    { label: "디자인", href: ROUTES.community.HR_GENERAL_AFFAIRS },
    { label: "디자인", href: ROUTES.community.DESIGN },
  ],
} as const;
