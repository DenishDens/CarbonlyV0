import type React from "react"
import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import DashboardLayoutClient from "./DashboardLayoutClient"

export const metadata: Metadata = {
  title: "Dashboard | Carbonly.ai",
  description: "Monitor and manage your carbon emissions",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  return <DashboardLayoutClient initialUser={user}>{children}</DashboardLayoutClient>
}

