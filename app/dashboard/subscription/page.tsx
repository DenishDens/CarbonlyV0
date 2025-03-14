import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getUserRole } from "@/lib/user"
import { SubscriptionDetails } from "@/components/subscription/subscription-details"
import { createClient } from "@/lib/supabase/server"

export default async function SubscriptionPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const userRole = await getUserRole(session.user.id)
  if (userRole !== "owner") {
    redirect("/dashboard")
  }

  // Get user's organization ID
  const client = createClient()
  const { data: profile, error } = await client
    .from("user_profiles")
    .select("organization_id")
    .eq("user_id", session.user.id)
    .single()

  if (error || !profile?.organization_id) {
    console.error("Error fetching organization ID:", error)
    redirect("/dashboard")
  }

  return (
    <div className="container max-w-5xl py-8">
      <SubscriptionDetails organizationId={profile.organization_id} />
    </div>
  )
}
