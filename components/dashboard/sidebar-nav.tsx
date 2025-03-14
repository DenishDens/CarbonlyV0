import { BarChart, Bot, CreditCard, Gauge, LayoutDashboard, ListChecks, Lock, ShoppingBag, Users } from "lucide-react"

import type { NavItem as NavItemType } from "@/types"

interface SidebarNavProps {
  items: NavItemType[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <div className="flex-col space-y-1">
      {items.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </div>
  )
}

const NavItem = ({ href, title, icon, variant }: NavItemType) => {
  return (
    <a href={href} className="flex items-center space-x-2 rounded-md p-2 hover:bg-secondary hover:text-foreground">
      {icon}
      <span>{title}</span>
    </a>
  )
}

export const defaultItems: NavItemType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Sales",
    href: "/dashboard/sales",
    icon: <BarChart className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: <ShoppingBag className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: <ListChecks className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: <Users className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <Gauge className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: <CreditCard className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: <Bot className="h-5 w-5" />,
    variant: "default",
  },
]

export const adminItems: NavItemType[] = [
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: <Users className="h-5 w-5" />,
    variant: "default",
  },
  {
    title: "Roles",
    href: "/dashboard/admin/roles",
    icon: <Lock className="h-5 w-5" />,
    variant: "default",
  },
]

