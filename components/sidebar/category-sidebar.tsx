"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { COMMUNITY_CATEGORY_LIST, RANK_CATEGORY_LIST } from "./constant";

const ROUTES = {
  RANK: "/rank",
} as const;

const SIDEBAR_STYLES = {
  CONTAINER: "w-full p-4 border border-gray-100 rounded-10",
  TITLE: "heading-small",
  SEPARATOR: "my-3 mx-0",
  SIDEBAR: "w-full h-auto border-r-0",
  CONTENT: "rounded-lg h-auto border-0",
  GROUP_CONTENT: "border-none bg-none",
  MENU: "gap-y-0",
} as const;

const MENU_ITEM_STYLES = {
  BASE: "label-medium bg-white text-gray-600 rounded-[10px] h-11.5 w-full hover:text-frog-600 hover:bg-white",
  ACTIVE: "text-frog-600 bg-frog-100 transition-300",
  LINK: "w-full",
} as const;

interface CategorySidebarProps {
  title: string;
  children: React.ReactElement<CategorySidebarItemProps>;
}

interface CategorySidebarItemProps {
  categories:
    | typeof RANK_CATEGORY_LIST.items
    | typeof COMMUNITY_CATEGORY_LIST.items;
}

// ==================== 컴포넌트 ====================

/**
 * Prog 사이드바 메인 컴포넌트
 * 현재 경로에 따라 랭킹 또는 커뮤니티 사이드바를 표시합니다.
 */
export function ProgSidebar() {
  const pathname = usePathname();

  // 현재 경로에 따라 사이드바 목록 결정
  const sidebarList = useMemo(() => {
    return pathname.includes(ROUTES.RANK)
      ? RANK_CATEGORY_LIST
      : COMMUNITY_CATEGORY_LIST;
  }, [pathname]);

  return (
    <CategorySidebar title={sidebarList.title}>
      <CategorySidebarItem categories={sidebarList.items} />
    </CategorySidebar>
  );
}

/**
 * 카테고리 사이드바 컨테이너 컴포넌트
 * 제목과 카테고리 아이템들을 렌더링합니다.
 */
function CategorySidebar({ title, children }: CategorySidebarProps) {
  return (
    <div className={SIDEBAR_STYLES.CONTAINER}>
      <h2 className={SIDEBAR_STYLES.TITLE}>{title}</h2>

      <SidebarSeparator className={SIDEBAR_STYLES.SEPARATOR} />

      <Sidebar className={SIDEBAR_STYLES.SIDEBAR}>
        <SidebarContent className={SIDEBAR_STYLES.CONTENT}>
          <SidebarGroupContent className={SIDEBAR_STYLES.GROUP_CONTENT}>
            <SidebarMenu className={SIDEBAR_STYLES.MENU}>
              {children}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}

/**
 * 카테고리 사이드바 아이템 컴포넌트
 * 카테고리 목록을 순회하며 링크 아이템을 생성합니다.
 */
function CategorySidebarItem({ categories }: CategorySidebarItemProps) {
  const pathname = usePathname();

  // 활성 상태 확인 함수
  const isActive = (href: string): boolean => {
    return pathname.includes(href);
  };

  // 메뉴 아이템 스타일 계산 함수
  const getMenuItemStyle = (href: string): string => {
    return isActive(href)
      ? cn(MENU_ITEM_STYLES.BASE, MENU_ITEM_STYLES.ACTIVE)
      : MENU_ITEM_STYLES.BASE;
  };

  return (
    <>
      {categories.map((item) => {
        const menuItemStyle = getMenuItemStyle(item.href);
        const isCurrentPage = isActive(item.href);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              className={menuItemStyle}
              asChild
              aria-current={isCurrentPage ? "page" : undefined}
            >
              <Link href={item.href} className={MENU_ITEM_STYLES.LINK}>
                {item.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
