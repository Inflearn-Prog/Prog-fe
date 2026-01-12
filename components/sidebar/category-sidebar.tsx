"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const categories = [
  {
    label: "카테고리 1",
    href: "/test",
  },
  {
    label: "카테고리 2",
    href: ROUTES.mypage.PROFILE,
  },
  {
    label: "카테고리 3",
    href: ROUTES.mypage.PROFILE,
  },
  {
    label: "카테고리 4",
    href: ROUTES.rank.ROOT,
  },
  {
    label: "카테고리 5",
    href: ROUTES.search.ROOT,
  },
];

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";

interface CategorySidebarProps {
  title: string;
  children: React.ReactElement<CategorySidebarItemProps>;
}
export function CategorySidebar({ title, children }: CategorySidebarProps) {
  return (
    <div className="w-full p-4 border border-gray-100 rounded-10">
      <h2 className="heading-small">{title}</h2>

      <SidebarSeparator className="my-3 mx-0" />
      <Sidebar className="w-full h-auto border-r-0">
        <SidebarContent className="rounded-lg h-auto border-0">
          <SidebarGroupContent className="border-none bg-none">
            <SidebarMenu className="gap-y-0">{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}

interface CategorySidebarItemProps {
  categories: Array<{ label: string; href: string }>;
}
export function CategorySidebarItem({ categories }: CategorySidebarItemProps) {
  const sidebarStyle =
    "label-medium bg-white text-gray-600 rounded-[10px] h-11.5 w-full hover:text-frog-600 hover:bg-white ";
  const sidebarActiveStyle = "text-frog-600 bg-frog-100 transition-300";

  const pathName = usePathname();

  return categories.map((item) => {
    const activeStyle = item.href.includes(pathName)
      ? cn(sidebarStyle, sidebarActiveStyle)
      : sidebarStyle;
    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton className={activeStyle} asChild>
          <Link href={item.href} className="w-full">
            {item.label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  });
}
