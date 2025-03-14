"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  BarChart3,
  FileUp,
  Settings,
  Users,
  Database,
  CreditCard,
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AIAssistant from "@/components/dashboard/ai-assistant"
import type { User } from "@/types/user"
import { Logo } from "@/components/ui/logo"

type NavigationItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Emission Data", href: "/dashboard/emission-data", icon: FileUp },
  { name: "Projects", href: "/dashboard/projects", icon: Database },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Material Library", href: "/dashboard/materials", icon: Database },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayoutClient({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle sidebar state
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed")
    if (storedState) {
      setSidebarCollapsed(storedState === "true")
    }

    // Handle responsive design
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle authentication
  useEffect(() => {
    if (!initialUser) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`)
    }
  }, [initialUser, pathname, router])

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  if (!initialUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full w-64"
            : sidebarCollapsed
              ? "w-16"
              : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div
            className={`flex items-center h-16 px-4 border-b border-gray-200 ${sidebarCollapsed && !isMobile ? "justify-center" : "justify-between"}`}
          >
            {(!sidebarCollapsed || isMobile) ? (
              <Logo />
            ) : (
              <Leaf className="h-6 w-6 text-green-600" />
            )}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-green-50 text-green-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
                  >
                    <item.icon
                      className={`${sidebarCollapsed && !isMobile ? "mr-0" : "mr-3"} h-5 w-5 ${isActive ? "text-green-600" : "text-gray-400"}`}
                    />
                    {(!sidebarCollapsed || isMobile) && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User menu */}
          <div
            className={`flex items-center p-4 border-t border-gray-200 ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center ${sidebarCollapsed && !isMobile ? "w-auto p-0" : "w-full text-left"}`}
                >
                  <Avatar className={`h-8 w-8 ${sidebarCollapsed && !isMobile ? "" : "mr-2"}`}>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={initialUser?.email || "User"} />
                    <AvatarFallback>{initialUser?.email?.[0].toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  {(!sidebarCollapsed || isMobile) && (
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{initialUser?.email}</p>
                      <p className="text-xs text-gray-500 truncate">User</p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Back to Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.replace("/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`${isMobile ? "pt-16" : ""} ${
          isMobile ? "pl-0" : sidebarCollapsed ? "pl-16" : "pl-64"
        } transition-all duration-300`}
      >
        <main className="min-h-screen p-4 md:p-8">{children}</main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}

