import { ROUTES } from "@/lib/routes";

interface HeaderNavItem {
  label: string;
  href: string;
  /** 새 탭으로 열기 (정적 FAQ 페이지 등 앱 외부 셸 문서용) */
  newTab?: boolean;
}

export const HEADER_NAV_LIST: HeaderNavItem[] = [
  {
    label: "랭킹",
    href: ROUTES.rank.ROOT,
  },
  {
    label: "커뮤니티",
    href: ROUTES.community.ROOT,
  },
  {
    label: "자주 묻는 질문",
    href: ROUTES.question.ROOT,
    newTab: true,
  },
  {
    label: "마이페이지",
    href: ROUTES.mypage.ROOT,
  },
];
