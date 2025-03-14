import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/session"
import { ProjectsList } from "@/components/projects/projects-list"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsSkeleton } from "@/components/projects/projects-skeleton"
import { Database } from "@/lib/supabase/types"
import { PostgrestSingleResponse } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

type Tables = Database["public"]["Tables"]
type UserProfile = Tables["user_profiles"]["Row"]

export const metadata = {
  title: "Projects | Carbonly",
  description: "Manage your carbon emission projects",
}

async function getUserProfile(userId: string): Promise<Pick<UserProfile, "organization_id"> | null> {
  const supabase = createClient()
  
  const query = supabase
    .from("user_profiles")
    .select("organization_id")
    .eq("user_id", userId as string)
    .single()

  const result = await query

  if (result.error || !result.data) {
    console.error("Error fetching user profile:", result.error?.message)
    return null
  }

  return result.data
}

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect("/dashboard/settings")
  }

  const { organization_id } = profile

  if (!organization_id) {
    redirect("/dashboard/settings")
  }

  return (
    <div className="flex flex-col gap-8">
      <ProjectsHeader />
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsList userId={user.id} organizationId={organization_id} />
      </Suspense>
    </div>
  )
}
