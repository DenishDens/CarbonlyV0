import { createClient } from "@/lib/supabase/server"
import { Database } from "@/lib/supabase/types"

type Tables = Database["public"]["Tables"]
type UserRole = "owner" | "admin" | "member"

export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const supabase = createClient()

    // Get user's profile and organization role
    const { data, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching user role:", error)
      return "member"
    }

    if (!data?.role) {
      return "member"
    }

    return data.role as UserRole
  } catch (err) {
    console.error("Error in getUserRole:", err)
    return "member"
  }
}
