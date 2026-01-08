import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function CategorySidebar() {
  return (
    <div className="w-full bg-red-300">
      <Sidebar className="w-full h-auto">
        <SidebarContent className="bg-white rounded-lg h-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="hover:bg-inherit hover:text-red-500"
                  asChild
                >
                  <p className="w-full ">카테고리 1</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
