import Link from "next/link";

import { ROUTES } from "@/lib/routes";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function CategorySidebar() {
  const sidebarStyle =
    "label-medium bg-white text-gray-600 rounded-[10px] h-11.5 w-full hover:text-frog-600 hover:bg-white active:text-frog-600 active:bg-grog-100";
  return (
    <div className="w-full bg-red-300">
      <Sidebar className="w-full h-auto">
        <SidebarContent className="bg-green-300 rounded-lg h-auto">
          <SidebarGroupContent>
            <SidebarMenu className="bg-blue-600">
              <SidebarMenuItem className="bg-red-500">
                <SidebarMenuButton className={`${sidebarStyle}`} asChild>
                  <Link href={ROUTES.mypage.ACTIVITY} className="w-full">
                    카테고리 1
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="bg-red-50">
                <SidebarMenuButton className="" asChild>
                  <p className="w-full ">카테고리 2</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
