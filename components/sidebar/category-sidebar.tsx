"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { COMMUNITY_CATEGORY_LIST, RANK_CATEGORY_LIST } from "./constant";

// ROUTES.rank 및 ROUTES.community 문자열 값 기반 타입
type RankRouteValue = (typeof ROUTES.rank)[keyof typeof ROUTES.rank];
type CommunityRouteValue = Extract<
  (typeof ROUTES.community)[keyof typeof ROUTES.community],
  string
>;
type CategoryRouteValue = RankRouteValue | CommunityRouteValue;

const SIDEBAR_STYLES = {
  CONTAINER: "bg-white w-full p-4 border border-gray-100 rounded-10",
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
  LINK: cn("w-full"),
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
    return pathname.includes(ROUTES.rank.ROOT)
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
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";

  // 활성 상태 확인 함수 (ROUTES.rank 또는 ROUTES.community 값과 비교)
  const isActive = (href: CategoryRouteValue): boolean => {
    const [, query] = href.split("?");
    const params = new URLSearchParams(query ?? "");
    return (params.get("category") ?? "") === categoryParam;
  };

  return (
    <>
      {categories.map((item) => {
        const isCurrentPage = isActive(item.href as CategoryRouteValue);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isSubActive =
          hasSubItems &&
          item.subItems!.some((sub) =>
            isActive(sub.href as CategoryRouteValue)
          );
        const isOpenByDefault = isCurrentPage || isSubActive;

        if (hasSubItems) {
          return (
            <Collapsible
              key={item.href}
              defaultOpen={isOpenByDefault}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      MENU_ITEM_STYLES.BASE,
                      isCurrentPage || isSubActive
                        ? "text-frog-600 bg-frog-100 font-medium hover:text-frog-600 hover:bg-frog-100"
                        : "",
                      "justify-between"
                    )}
                    asChild
                  >
                    <Link href={item.href} className={MENU_ITEM_STYLES.LINK}>
                      {item.label}
                      <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-none mt-1 pl-4 mx-0 mr-0">
                    {item.subItems!.map((subItem) => {
                      const isSubCurrent = isActive(
                        subItem.href as CategoryRouteValue
                      );
                      return (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubCurrent}
                            className={cn(
                              "text-gray-500 hover:text-gray-900 hover:bg-transparent bg-transparent",
                              isSubCurrent && "text-frog-600 font-medium"
                            )}
                          >
                            <Link href={subItem.href}>{subItem.label}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        const menuItemStyle = cn(
          MENU_ITEM_STYLES.BASE,
          isCurrentPage ? MENU_ITEM_STYLES.ACTIVE : ""
        );

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
