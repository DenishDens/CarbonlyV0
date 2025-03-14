"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Home,
  Settings,
  Users,
  AlertTriangle,
  Folder,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useSidebarContext } from "@/contexts/sidebar-context"

interface SidebarProps {
  userRole?: string
}

export function UnifiedSidebar({ userRole = "user" }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebarContext()
  const isAdmin = userRole === "admin"

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
          isOpen ? "w-64" : "w-16",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-3 hidden md:flex h-6 w-6 rounded-full border shadow-sm bg-background"
          onClick={toggle}
        >
          {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
        <ScrollArea className="h-full py-6">
          <nav className="grid gap-2 px-2">
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === "/dashboard" && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <Home className="h-5 w-5" />
                {isOpen && <span>Dashboard</span>}
              </Button>
            </Link>
            <Link href="/dashboard/projects" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname?.startsWith("/dashboard/projects") && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <Folder className="h-5 w-5" />
                {isOpen && <span>Projects</span>}
              </Button>
            </Link>
            <Link href="/dashboard/emission-data" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname?.startsWith("/dashboard/emission-data") && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <Database className="h-5 w-5" />
                {isOpen && <span>Emission Data</span>}
              </Button>
            </Link>
            <Link href="/dashboard/materials" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname?.startsWith("/dashboard/materials") && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <Layers className="h-5 w-5" />
                {isOpen && <span>Material Library</span>}
              </Button>
            </Link>
            <Link href="/dashboard/reports" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname?.startsWith("/dashboard/reports") && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <BarChart3 className="h-5 w-5" />
                {isOpen && <span>Reports</span>}
              </Button>
            </Link>
            <Link href="/dashboard/incidents" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname?.startsWith("/dashboard/incidents") && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <AlertTriangle className="h-5 w-5" />
                {isOpen && <span>Incidents</span>}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/dashboard/users" passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname?.startsWith("/dashboard/users") && "bg-muted",
                    !isOpen && "justify-center",
                  )}
                >
                  <Users className="h-5 w-5" />
                  {isOpen && <span>Users</span>}
                </Button>
              </Link>
            )}
            <Link href="/dashboard/profile" passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname?.startsWith("/dashboard/profile") && "bg-muted",
                  !isOpen && "justify-center",
                )}
              >
                <Settings className="h-5 w-5" />
                {isOpen && <span>Profile</span>}
              </Button>
            </Link>
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}

