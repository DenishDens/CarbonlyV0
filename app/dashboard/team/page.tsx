import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamMembers } from "@/components/team/team-members"
import { InviteTeamMember } from "@/components/team/invite-team-member"

export const metadata: Metadata = {
  title: "Team",
  description: "Manage your team members and their roles.",
}

export default async function TeamPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Team" text="Manage your team members and their roles." />
      <div className="grid gap-8">
        <TeamMembers />
        <InviteTeamMember />
      </div>
    </DashboardShell>
  )
}

