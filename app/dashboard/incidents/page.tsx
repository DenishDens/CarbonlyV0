import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"
import { IncidentsList } from "@/components/incidents/incidents-list"
import { IncidentsHeader } from "@/components/incidents/incidents-header"
import { getCurrentUser } from "@/lib/session"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/lib/supabase/types"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type Tables = Database["public"]["Tables"]
type UserProfile = Tables["user_profiles"]["Row"]

async function getUserProfile(userId: string): Promise<Pick<UserProfile, "organization_id"> | null> {
  const supabase = createClient()
  
  const query = supabase
    .from("user_profiles")
    .select("organization_id")
    .eq("user_id", userId)
    .single()

  const result = await query

  if (result.error || !result.data) {
    console.error("Error fetching user profile:", result.error?.message)
    return null
  }

  return result.data
}

export default async function IncidentsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Please sign in to view incidents.</p>
      </div>
    )
  }

  const profile = await getUserProfile(user.id)

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Unable to load user profile. Please try again later.</p>
      </div>
    )
  }

  const { organization_id } = profile

  if (!organization_id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No organization found. Please contact support.</p>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader heading="Incidents" text="Track and manage environmental incidents." />
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Suspense fallback={<IncidentsHeaderSkeleton />}>
          <IncidentsHeader organizationId={organization_id} />
        </Suspense>
        <Suspense fallback={<IncidentsListSkeleton />}>
          <IncidentsList organizationId={organization_id} />
        </Suspense>
      </div>
    </>
  )
}

function IncidentsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-40" />
    </div>
  )
}

function IncidentsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
    </div>
  )
}
