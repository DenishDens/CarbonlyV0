import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/session"
import { TeamManagement } from "@/components/teams/team-management"
import { TeamSkeleton } from "@/components/teams/team-skeleton"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Team Management | Carbonly",
  description: "Manage your organization's team members and invitations",
}

async function getUserProfile(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("user_profiles")
    .select("organization_id, role")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function TeamsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect("/dashboard/settings")
  }

  const { organization_id, role } = profile

  if (!organization_id) {
    redirect("/dashboard/settings")
  }

  // Only allow admins to access team management
  if (role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">Manage your organization's team members and invitations</p>
      </div>
      <Suspense fallback={<TeamSkeleton />}>
        <TeamManagement organizationId={organization_id} userId={user.id} />
      </Suspense>
    </div>
  )
} 