import { createClient } from "@/lib/supabase/server"

/**
 * Get all organizations that a user has access to
 * @param userId The user ID
 * @returns Array of organization objects
 */
export async function getUserOrganizations(userId: string) {
  const supabase = createClient()

  // Check for admin or super admin role
  const { data: userRoles } = await supabase.from("user_roles").select("role").eq("user_id", userId)

  const isAdmin = userRoles?.some((ur) => ["admin", "super_admin"].includes(ur.role))

  if (isAdmin) {
    // Admin users can access all organizations
    const { data: allOrgs } = await supabase.from("organizations").select("*")

    return allOrgs || []
  } else {
    // Regular users can only access organizations they're linked to
    const { data: orgUsers } = await supabase.from("organization_users").select("organization_id").eq("user_id", userId)

    if (!orgUsers || orgUsers.length === 0) {
      return []
    }

    const orgIds = orgUsers.map((ou) => ou.organization_id)

    const { data: userOrgs } = await supabase.from("organizations").select("*").in("id", orgIds)

    return userOrgs || []
  }
}

