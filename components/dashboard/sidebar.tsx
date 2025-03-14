import { LayoutDashboard, Users, Calendar, FileText, Sparkles } from "lucide-react"

import { NavItem } from "@/components/nav/nav-item"

interface SidebarProps {
  isCollapsed: boolean
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Members",
      href: "/dashboard/members",
      icon: Users,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
    {
      title: "AI Assistant",
      href: "/dashboard/ai-assistant",
      icon: Sparkles,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              title={route.title}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

