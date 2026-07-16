import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  CalendarClock,
  MessageSquare,
  Settings,
  Info,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meeting Summarizer", url: "/summarizer", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarClock },
  { title: "AI Chat Assistant", url: "/chat", icon: MessageSquare },
] as const;

const secondary = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "About", url: "/about", icon: Info },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold leading-tight">AI PA</div>
            <div className="truncate text-xs text-muted-foreground">Productivity Assistant</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primary.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} onClick={handleNavClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <p className="px-2 py-1 text-[11px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          AI outputs may contain errors. Review before acting.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
