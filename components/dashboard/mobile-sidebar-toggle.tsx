"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebarContext } from "@/contexts/sidebar-context"

export function MobileSidebarToggle({ userRole }: { userRole?: string }) {
  const { toggle } = useSidebarContext()

  return (
    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )
}

